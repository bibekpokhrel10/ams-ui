import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Breadcrumbs,
  Link,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import ClassIcon from '@mui/icons-material/Class';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchClasses, createClass, deleteClass, updateClass, fetchInstructors } from '../action/class';

// ... (keep all the styled components and textfieldStyle the same)
const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#F8DEF5',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '50px',
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '900px',
  minHeight: '300px',
}));

const RoundedButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: theme.spacing(1, 4),
}));

const textfieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: '#C215AE',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C215AE',
    },
    '& input': {
      paddingLeft: '40px',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#C215AE',
    },
  },
  '& .MuiInputAdornment-root': {
    position: 'absolute',
    left: '14px',
  },
  backgroundColor: 'white',
  borderRadius: '50px',
};

const ClassPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const courseName = location.state?.courseName || "Unknown Course";
    const courseId = location.state?.courseId || '';
    const institutionId = location.state?.institutionId || '';
    const classes = useSelector(state => state.classes.list || []);
    const instructors = useSelector(state => state.classes.instructors || []);
    const loading = useSelector(state => state.classes.loading);
    const error = useSelector(state => state.classes.error);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuClass, setMenuClass] = useState(null);
  
    useEffect(() => {
      dispatch(fetchClasses(courseId));
      dispatch(fetchInstructors(institutionId));
    }, [dispatch, courseId, institutionId]);
  
    const validationSchema = Yup.object({
      year: Yup.number()
        .required('Required')
        .min(2000, 'Year must be 2000 or later')
        .max(2100, 'Year must be 2100 or earlier'),
      schedule: Yup.string().required('Required'),
      instructor_id: Yup.number().required('Required'),
    });
  
    const formik = useFormik({
      initialValues: {
        year: new Date().getFullYear(),
        schedule: '',
        instructor_id: '',
      },
      validationSchema,
      onSubmit: async (values, { resetForm }) => {
        try {
          const classPayload = {
            ...values,
            course_id: courseId,
          };
          const response = await dispatch(createClass(classPayload));
          if (response.success) {
            setSnackbarMessage('Class created successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setOpenDialog(false);
            resetForm();
            dispatch(fetchClasses(courseId));
          } else {
            throw new Error(response.message || 'Failed to create class');
          }
        } catch (error) {
          setSnackbarMessage(error.message || 'An error occurred. Please try again.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      },
    });
  
    const editFormik = useFormik({
      initialValues: {
        year: selectedClass ? selectedClass.year : new Date().getFullYear(),
        schedule: selectedClass ? selectedClass.schedule : '',
        instructor_id: selectedClass ? selectedClass.instructor_id : '',
      },
      validationSchema,
      onSubmit: async (values) => {
        try {
          const classPayload = {
            ...values,
            id: selectedClass.id,
            course_id: courseId,
          };
          const response = await dispatch(updateClass(classPayload));
          if (response.success) {
            setSnackbarMessage('Class updated successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setOpenEditDialog(false);
            dispatch(fetchClasses(courseId));
          } else {
            throw new Error(response.message || 'Failed to update class');
          }
        } catch (error) {
          setSnackbarMessage(error.message || 'An error occurred. Please try again.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      },
    });

    const handleEnrollmentClick = (classItem) => {
      navigate('/classes/enrollment', {
        state: {
          classId: classItem.id,
          className: `${courseName} - ${classItem.schedule}`,
          courseId: courseId,
          institutionId: institutionId,
          year: classItem.year,
          schedule: classItem.schedule,
          instructorName: getInstructorName(classItem.instructor_id)
        }
      });
      handleMenuClose();
    };
  
    // Rest of the utility functions (handleClose, handleDelete, etc.) similar to CoursePage
    const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackbar(false);
    };
  
    const handleMenuOpen = (event, classItem) => {
      setAnchorEl(event.currentTarget);
      setMenuClass(classItem);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      setMenuClass(null);
    };
  
    const handleDeleteClass = async () => {
      try {
        const response = await dispatch(deleteClass(menuClass.id));
        if (response.success) {
          setSnackbarMessage('Class deleted successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          dispatch(fetchClasses(courseId));
        } else {
          throw new Error(response.message || 'Failed to delete class');
        }
      } catch (error) {
        setSnackbarMessage(error.message || 'An error occurred. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
      handleMenuClose();
    };
  
    const handleEditClass = (classItem) => {
      setSelectedClass(classItem);
      setOpenEditDialog(true);
      handleMenuClose();
    };
  
    useEffect(() => {
      if (selectedClass) {
        editFormik.setValues({
          year: selectedClass.year,
          schedule: selectedClass.schedule,
          instructor_id: selectedClass.instructor_id,
        });
      }
    }, [selectedClass]);
  const safeClasses = Array.isArray(classes) ? classes : [];

  const filteredClasses = safeClasses.filter(classItem =>
    classItem.schedule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.year.toString().includes(searchTerm) ||
    instructors.find(i => i.id === classItem.instructor_id)?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInstructorName = (instructorId) => {
    const instructor = instructors.find(i => i.id === instructorId);
    return instructor ? instructor.name : 'Unknown Instructor';
  };

  return (
    <StyledContainer>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box sx={{ alignSelf: 'flex-start', width: '100%', mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/institution" onClick={(e) => { e.preventDefault(); navigate('/institution'); }}>
              Institutions
            </Link>
            <Link color="inherit" href="/program" onClick={(e) => { e.preventDefault(); navigate(-3); }}>
              Programs
            </Link>
            <Link color="inherit" href="/semester" onClick={(e) => { e.preventDefault(); navigate(-2); }}>
              Semesters
            </Link>
            <Link color="inherit" href="/courses" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
              Courses
            </Link>
            <Typography color="text.primary">{courseName}</Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mt: 2 }}>
            Classes for {courseName}
          </Typography>
        </Box>
        <ContentBox>
          <Box sx={{ display: 'flex', mb: 2, width: '100%', justifyContent: 'space-between' }}>
            <TextField
              variant="outlined"
              placeholder="Search"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ ...textfieldStyle, flexGrow: 1, mr: 2, maxWidth: 'calc(100% - 120px)' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#C215AE' }} />
                  </InputAdornment>
                ),
              }}
            />
            <RoundedButton
              variant="contained"
              onClick={() => setOpenDialog(true)}
              sx={{ 
                backgroundColor: '#C215AE', 
                color: 'white', 
                '&:hover': { backgroundColor: '#9E1188' },
                minWidth: '100px'
              }}
            >
              CREATE
            </RoundedButton>
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }} aria-label="classes table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Schedule</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Instructor</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClasses.map((classItem) => (
                  <TableRow
                    key={classItem.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <TableCell>{classItem.year}</TableCell>
                    <TableCell>{classItem.schedule}</TableCell>
                    <TableCell>{getInstructorName(classItem.instructor_id)}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleMenuOpen(event, classItem)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ContentBox>
      </Container>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: '#F8DEF5',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle>Create Class</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="year"
            name="year"
            label="Year"
            type="number"
            fullWidth
            variant="outlined"
            value={formik.values.year}
            onChange={formik.handleChange}
            error={formik.touched.year && Boolean(formik.errors.year)}
            helperText={formik.touched.year && formik.errors.year}
            sx={textfieldStyle}
          />
          <TextField
            margin="dense"
            id="schedule"
            name="schedule"
            label="Schedule"
            type="text"
            fullWidth
            variant="outlined"
            value={formik.values.schedule}
            onChange={formik.handleChange}
            error={formik.touched.schedule && Boolean(formik.errors.schedule)}
            helperText={formik.touched.schedule && formik.errors.schedule}
            sx={textfieldStyle}
          />
          <FormControl fullWidth margin="dense" sx={textfieldStyle}>
            <InputLabel id="instructor-label">Instructor</InputLabel>
            <Select
              labelId="instructor-label"
              id="instructor_id"
              name="instructor_id"
              value={formik.values.instructor_id}
              onChange={formik.handleChange}
              error={formik.touched.instructor_id && Boolean(formik.errors.instructor_id)}
              label="Instructor"
            >
              {instructors.map((instructor) => (
                console.log(instructor),
                <MenuItem key={instructor.id} value={instructor.id}>
                  {instructor.first_name + ' ' + instructor.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <RoundedButton 
            onClick={formik.handleSubmit} 
            variant="contained"
            sx={{ backgroundColor: '#C215AE', color: 'white', '&:hover': { backgroundColor: '#9E1188' } }}
          >
            Create
          </RoundedButton>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: '#F8DEF5',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle>Edit Class</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="year"
            name="year"
            label="Year"
            type="number"
            fullWidth
            variant="outlined"
            value={editFormik.values.year}
            onChange={editFormik.handleChange}
            error={editFormik.touched.year && Boolean(editFormik.errors.year)}
            helperText={editFormik.touched.year && editFormik.errors.year}
            sx={textfieldStyle}
          />
          <TextField
            margin="dense"
            id="schedule"
            name="schedule"
            label="Schedule"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormik.values.schedule}
            onChange={editFormik.handleChange}
            error={editFormik.touched.schedule && Boolean(editFormik.errors.schedule)}
            helperText={editFormik.touched.schedule && editFormik.errors.schedule}
            sx={textfieldStyle}
          />
          <FormControl fullWidth margin="dense" sx={textfieldStyle}>
            <InputLabel id="edit-instructor-label">Instructor</InputLabel>
            <Select
              labelId="edit-instructor-label"
              id="instructor_id"
              name="instructor_id"
              value={editFormik.values.instructor_id}
              onChange={editFormik.handleChange}
              error={editFormik.touched.instructor_id && Boolean(editFormik.errors.instructor_id)}
              label="Instructor"
            >
              {instructors.map((instructor) => (
                <MenuItem key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <RoundedButton 
            onClick={editFormik.handleSubmit} 
            variant="contained"
            sx={{ backgroundColor: '#C215AE', color: 'white', '&:hover': { backgroundColor: '#9E1188' } }}
          >
            Update
          </RoundedButton>
        </DialogActions>
      </Dialog>

    
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEnrollmentClick(menuClass)}>
          <GroupIcon sx={{ mr: 1 }} />
          Enrollment
        </MenuItem>
        <MenuItem onClick={() => handleEditClass(menuClass)}>
          <ClassIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClass}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default ClassPage;