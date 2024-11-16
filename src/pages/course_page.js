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
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchCourses, createCourse, deleteCourse, updateCourse } from '../action/course';

// Styled components (reuse from SemesterPage)
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

const CoursePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const semesterName = location.state?.semesterName || "Unknown Semester";
  const semesterId = location.state?.semesterId || '';
  const courses = useSelector(state => state.courses.list || []);
  const loading = useSelector(state => state.courses.loading);
  const error = useSelector(state => state.courses.error);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuCourse, setMenuCourse] = useState(null);

  const handleCourseClick = (course) => {
    navigate(`/courses/${course.id}/classes`, { 
      state: { 
        courseId: course.id, 
        courseName: course.name,
        institutionId: course.institution_id // Make sure this is available in your course data
      }
    });
  };

  useEffect(() => {
    dispatch(fetchCourses(semesterId));
  }, [dispatch, semesterId]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleMenuOpen = (event, course) => {
    setAnchorEl(event.currentTarget);
    setMenuCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCourse(null);
  };

  const handleDeleteCourse = async () => {
    try {
      const response = await dispatch(deleteCourse(menuCourse.id));
      if (response.success) {
        setSnackbarMessage('Course deleted successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        dispatch(fetchCourses(semesterId));
      } else {
        throw new Error(response.message || 'Failed to delete course');
      }
    } catch (error) {
      setSnackbarMessage(error.message || 'An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    handleMenuClose();
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const formik = useFormik({
    initialValues: {
      code: '',
      name: '',
      credits: '',
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      credits: Yup.number().required('Required').positive('Must be positive').integer('Must be an integer'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const coursePayload = {
          code: values.code,
          name: values.name,
          credits: parseInt(values.credits),
          semester_id: semesterId,
        }
        const response = await dispatch(createCourse(coursePayload));
        if (response.success) {
          setSnackbarMessage('Course created successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setOpenDialog(false);
          resetForm();
          dispatch(fetchCourses(semesterId));
        } else {
          throw new Error(response.message || 'Failed to create course');
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
      code: selectedCourse ? selectedCourse.code : '',
      name: selectedCourse ? selectedCourse.name : '',
      credits: selectedCourse ? selectedCourse.credits : '',
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      credits: Yup.number().required('Required').positive('Must be positive').integer('Must be an integer'),
    }),
    onSubmit: async (values) => {
      try {
        const coursePayload = {
          id: selectedCourse.id,
          code: values.code,
          name: values.name,
          credits: parseInt(values.credits),
          semester_id: semesterId,
        }
        const response = await dispatch(updateCourse(coursePayload));
        if (response.success) {
          setSnackbarMessage('Course updated successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setOpenEditDialog(false);
          dispatch(fetchCourses(semesterId));
        } else {
          throw new Error(response.message || 'Failed to update course');
        }
      } catch (error) {
        setSnackbarMessage(error.message || 'An error occurred. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  useEffect(() => {
    if (selectedCourse) {
      editFormik.setValues({
        code: selectedCourse.code,
        name: selectedCourse.name,
        credits: selectedCourse.credits,
      });
    }
  }, [selectedCourse]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const safeCourses = Array.isArray(courses) ? courses : [];

  const filteredCourses = safeCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StyledContainer>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box sx={{ alignSelf: 'flex-start', width: '100%', mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/institution" onClick={(e) => { e.preventDefault(); navigate('/institution'); }}>
              Institutions
            </Link>
            <Link color="inherit" href="/program" onClick={(e) => { e.preventDefault(); navigate(-2); }}>
              Programs
            </Link>
            <Link color="inherit" href="/semester" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
              Semesters
            </Link>
            <Typography color="text.primary">{semesterName}</Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mt: 2 }}>
            Courses for {semesterName}
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
            <Table sx={{ minWidth: 650 }} aria-label="courses table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Credits</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created at</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow
                    key={course.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer'}
                    }}
                    onClick={() => handleCourseClick(course)}
                  >
                    <TableCell component="th" scope="row">
                      {course.code}
                    </TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>{formatDate(course.created_at)}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleMenuOpen(event, course)}>
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
        <DialogTitle>Create Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="code"
            name="code"
            label="Course Code"
            type="text"
            fullWidth
            variant="outlined"
            value={formik.values.code}
            onChange={formik.handleChange}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
            sx={textfieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon sx={{ color: '#C215AE' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="name"
            name="name"
            label="Course Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={textfieldStyle}
          />
          <TextField
            margin="dense"
            id="credits"
            name="credits"
            label="Credits"
            type="number"
            fullWidth
            variant="outlined"
            value={formik.values.credits}
            onChange={formik.handleChange}
            error={formik.touched.credits && Boolean(formik.errors.credits)}
            helperText={formik.touched.credits && formik.errors.credits}
            sx={textfieldStyle}
          />
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
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="code"
            name="code"
            label="Course Code"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormik.values.code}
            onChange={editFormik.handleChange}
            error={editFormik.touched.code && Boolean(editFormik.errors.code)}
            helperText={editFormik.touched.code && editFormik.errors.code}
            sx={textfieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon sx={{ color: '#C215AE' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="name"
            name="name"
            label="Course Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormik.values.name}
            onChange={editFormik.handleChange}
            error={editFormik.touched.name && Boolean(editFormik.errors.name)}
            helperText={editFormik.touched.name && editFormik.errors.name}
            sx={textfieldStyle}
          />
          <TextField
            margin="dense"
            id="credits"
            name="credits"
            label="Credits"
            type="number"
            fullWidth
            variant="outlined"
            value={editFormik.values.credits}
            onChange={editFormik.handleChange}
            error={editFormik.touched.credits && Boolean(editFormik.errors.credits)}
            helperText={editFormik.touched.credits && editFormik.errors.credits}
            sx={textfieldStyle}
          />
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
        <MenuItem onClick={() => handleEditCourse(menuCourse)}>
          <SchoolIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteCourse}>
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

export default CoursePage;