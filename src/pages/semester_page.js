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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchSemesters, createSemester, deleteSemester, updateSemester } from '../action/semester';
import { fetchUserProfile } from '../action/user';

// ... (keep all the styled components from the Program page)
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

const SemesterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const programName = location.state?.programName || "Unknown Program";
  const programId = location.state?.programId || '';
  const semesters = useSelector(state => state.semesters.list || []);
  const user = useSelector(state => state.user.profile);
  const loading = useSelector(state => state.semesters.loading);
  const error = useSelector(state => state.semesters.error);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSemester, setMenuSemester] = useState(null);

  const handleSemesterClick = (semester) => {
    navigate('/semesters/' + semester.id + '/courses', { 
      state: { 
        semesterName: semester.name,
        semesterId: semester.id,
        programName: programName,
        programId: programId
      } 
    });
  };

  useEffect(() => {
    dispatch(fetchSemesters(programId));
  }, [dispatch, programId]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleMenuOpen = (event, semester) => {
    setAnchorEl(event.currentTarget);
    setMenuSemester(semester);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuSemester(null);
  };

  const handleDeleteSemester = async () => {
    try {
      const response = await dispatch(deleteSemester(menuSemester.id));
      if (response.success) {
        setSnackbarMessage('Semester deleted successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        dispatch(fetchSemesters(programId));
      } else {
        throw new Error(response.message || 'Failed to delete semester');
      }
    } catch (error) {
      setSnackbarMessage(error.message || 'An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    handleMenuClose();
  };

  const handleEditSemester = (semester) => {
    setSelectedSemester(semester);
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      year: '',
      timePeriod: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      year: Yup.string().required('Required'),
      timePeriod: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const semesterPayload = {
          name: values.name,
          year: values.year,
          program_id: programId,
          time_period: values.timePeriod,
        }
        const response = await dispatch(createSemester(semesterPayload));
        if (response.success) {
          setSnackbarMessage('Semester created successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setOpenDialog(false);
          resetForm();
          dispatch(fetchSemesters(programId));
        } else {
          throw new Error(response.message || 'Failed to create semester');
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
      name: selectedSemester ? selectedSemester.name : '',
      year: selectedSemester ? selectedSemester.year : '',
      timePeriod: selectedSemester ? selectedSemester.time_period : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      year: Yup.string().required('Required'),
      timePeriod: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const semesterPayload = {
          id: selectedSemester.id,
          name: values.name,
          year: values.year,
          program_id: programId,
          time_period: values.timePeriod,
        }
        const response = await dispatch(updateSemester(semesterPayload));
        if (response.success) {
          setSnackbarMessage('Semester updated successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setOpenEditDialog(false);
          dispatch(fetchSemesters(programId));
        } else {
          throw new Error(response.message || 'Failed to update semester');
        }
      } catch (error) {
        setSnackbarMessage(error.message || 'An error occurred. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  useEffect(() => {
    if (selectedSemester) {
      editFormik.setValues({
        name: selectedSemester.name,
        year: selectedSemester.year,
        timePeriod: selectedSemester.time_period,
      });
    }
  }, [selectedSemester]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const safeSemesters = Array.isArray(semesters) ? semesters : [];

  const filteredSemesters = safeSemesters.filter(semester =>
    semester.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StyledContainer>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box sx={{ alignSelf: 'flex-start', width: '100%', mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
          {user.user_type === 'super_admin' && ( 
            <Link color="inherit" href="/institutions" onClick={(e) => { e.preventDefault(); navigate('/institutions'); }}>
              Institutions
            </Link>
          )}
            <Link color="inherit" href="/program" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
              Programs
            </Link>
            <Typography color="text.primary">{programName}</Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mt: 2 }}>
            Semesters for {programName}
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
            <Table sx={{ minWidth: 650 }} aria-label="semesters table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Time Period</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created at</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSemesters.map((semester) => (
                 <TableRow
                 key={semester.id}
                 sx={{ 
                   '&:last-child td, &:last-child th': { border: 0 },
                   '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' }
                 }}
                 onClick={() => handleSemesterClick(semester)}
               >
                    <TableCell component="th" scope="row">
                      {semester.name}
                    </TableCell>
                    <TableCell>{semester.year}</TableCell>
                    <TableCell>{semester.time_period}</TableCell>
                    <TableCell>{formatDate(semester.created_at)}</TableCell>
                    <TableCell align="right">
                    <IconButton 
                        onClick={(event) => {
                                event.stopPropagation();
                                handleMenuOpen(event, semester);
                        }}
                    >
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
        <DialogTitle>Create Semester</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Semester Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={textfieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: '#C215AE' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="year"
            name="year"
            label="Year"
            type="text"
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
            id="timePeriod"
            name="timePeriod"
            label="Time Period"
            type="text"
            fullWidth
            variant="outlined"
            value={formik.values.timePeriod}
            onChange={formik.handleChange}
            error={formik.touched.timePeriod && Boolean(formik.errors.timePeriod)}
            helperText={formik.touched.timePeriod && formik.errors.timePeriod}
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
        <DialogTitle>Edit Semester</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Semester Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormik.values.name}
            onChange={editFormik.handleChange}
            error={editFormik.touched.name && Boolean(editFormik.errors.name)}
            helperText={editFormik.touched.name && editFormik.errors.name}
            sx={textfieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: '#C215AE' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="year"
            name="year"
            label="Year"
            type="text"
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
            id="timePeriod"
            name="timePeriod"
            label="Time Period"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormik.values.timePeriod}
            onChange={editFormik.handleChange}
            error={editFormik.touched.timePeriod && Boolean(editFormik.errors.timePeriod)}
            helperText={editFormik.touched.timePeriod && editFormik.errors.timePeriod}
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
        <MenuItem onClick={() => handleEditSemester(menuSemester)}>
          <CalendarTodayIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteSemester}>
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

export default SemesterPage;