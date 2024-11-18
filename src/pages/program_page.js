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
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchPrograms, createProgram, deleteProgram, updateProgram } from '../action/program';

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

const ProgramPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const institutionName = location.state?.institutionName || "Unknown Institution";
  const institutionId = location.state?.institutionId || '';
  const programs = useSelector(state => state.programs.list || []);
  const totalPrograms = useSelector(state => state.programs.total || 0);
  const loading = useSelector(state => state.programs.loading);
  const error = useSelector(state => state.programs.error);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProgram, setMenuProgram] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const fetchPaginatedPrograms = () => {
    const listRequest = {
      page: page + 1,
      size: rowsPerPage,
      sort_column: sortColumn,
      sort_direction: sortDirection,
      query: searchTerm,
    };
    dispatch(fetchPrograms(institutionId,listRequest));
  };

  useEffect(() => {
    fetchPaginatedPrograms();
  }, [dispatch, institutionId, page, rowsPerPage, sortColumn, sortDirection, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };

  useEffect(() => {
    dispatch(fetchPrograms(institutionId));
  }, [dispatch, institutionId]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

   const handleMenuOpen = (event, program) => {
    // Stop the click event from bubbling up to the table row
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuProgram(program);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProgram(null);
  };

  const handleDeleteProgram = async () => {
    try {
      const response = await dispatch(deleteProgram(menuProgram.id));
      if (response.success) {
        setSnackbarMessage('Program deleted successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        dispatch(fetchPrograms(institutionId));
      } else {
        throw new Error(response.message || 'Failed to delete program');
      }
    } catch (error) {
      setSnackbarMessage(error.message || 'An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    handleMenuClose();
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleProgramClick = (program) => {
    navigate(`/programs/${program.id}/semesters`, { state: { programId: program.id, programName: program.name, institutionName: institutionName, institutionId: institutionId } });
  };

  const handleEnrollmentClick = (program) => {
    navigate(`/programs/${program.id}/enrollments`, { 
      state: { 
        programId: program.id, 
        programName: program.name,
        institutionName: institutionName,
        institutionId: institutionId
      } 
    });
    handleMenuClose();
  };

  const formik = useFormik({
    initialValues: {
      programName: '',
    },
    validationSchema: Yup.object({
      programName: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const programPayload = {
          name: values.programName,
          institution_id: institutionId,
        }
        // console.log("program payload :: ", programPayload);
        const response = await dispatch(createProgram(programPayload));
        if (response.success) {
          setSnackbarMessage('Program created successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setOpenDialog(false);
          resetForm();
          dispatch(fetchPrograms(institutionId));
        } else {
          throw new Error(response.message || 'Failed to create program');
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
      programName: selectedProgram ? selectedProgram.name : '',
    },
    validationSchema: Yup.object({
      programName: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const programPayload = {
          id: selectedProgram.id,
          name: values.programName,
          institutionId: institutionId,
        }
        const response = await dispatch(updateProgram(programPayload));
        if (response.success) {
          setSnackbarMessage('Program updated successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setOpenEditDialog(false);
          dispatch(fetchPrograms(institutionId));
        } else {
          throw new Error(response.message || 'Failed to update program');
        }
      } catch (error) {
        setSnackbarMessage(error.message || 'An error occurred. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  useEffect(() => {
    if (selectedProgram) {
      editFormik.setValues({ programName: selectedProgram.name });
    }
  }, [selectedProgram]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const safePrograms = Array.isArray(programs) ? programs : [];

  const filteredPrograms = safePrograms.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StyledContainer>
<Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box sx={{ alignSelf: 'flex-start', width: '100%', mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/institutions" onClick={(e) => { e.preventDefault(); navigate('/institutions'); }}>
              Institutions
            </Link>
            <Typography color="text.primary">{institutionName}</Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mt: 2 }}>
            Programs for {institutionName}
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
            <Table sx={{ minWidth: 650 }} aria-label="programs table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={sortColumn === 'id'}
                      direction={sortColumn === 'id' ? sortDirection : 'asc'}
                      onClick={() => handleSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={sortColumn === 'name'}
                      direction={sortColumn === 'name' ? sortDirection : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={sortColumn === 'created_at'}
                      direction={sortColumn === 'created_at' ? sortDirection : 'asc'}
                      onClick={() => handleSort('created_at')}
                    >
                      Created at
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
            {programs.map((program) => (
              <TableRow
                key={program.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' }
                }}
                onClick={() => handleProgramClick(program)}
              >
                <TableCell>{program.id}</TableCell>
                <TableCell component="th" scope="row">
                  {program.name}
                </TableCell>
                <TableCell>{formatDate(program.created_at)}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={(event) => handleMenuOpen(event, program)}
                    sx={{ 
                      '&:hover': { backgroundColor: 'rgba(194, 21, 174, 0.04)' },
                      zIndex: 2 // Ensure the button appears above other elements
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
          <TablePagination
            component="div"
            count={totalPrograms}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
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
        <DialogTitle>Create Program</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="programName"
            name="programName"
            label="Program Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formik.values.programName}
            onChange={formik.handleChange}
            error={formik.touched.programName && Boolean(formik.errors.programName)}
            helperText={formik.touched.programName && formik.errors.programName}
            sx={textfieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon sx={{ color: '#C215AE' }} />
                </InputAdornment>
              ),
            }}
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
        <DialogTitle>Edit Program</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="programName"
            name="programName"
            label="Program Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormik.values.programName}
            onChange={editFormik.handleChange}
            error={editFormik.touched.programName && Boolean(editFormik.errors.programName)}
            helperText={editFormik.touched.programName && editFormik.errors.programName}
            sx={textfieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon sx={{ color: '#C215AE' }} />
                </InputAdornment>
              ),
            }}
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
        <MenuItem onClick={() => handleEditProgram(menuProgram)}>
          <SchoolIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleEnrollmentClick(menuProgram)}>
          <PersonAddIcon sx={{ mr: 1 }} />
          Enrollments
        </MenuItem>
        <MenuItem onClick={handleDeleteProgram}>
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

export default ProgramPage;