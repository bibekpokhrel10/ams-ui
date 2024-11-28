import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
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
  Breadcrumbs,
  Link,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Chip,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchEnrolledStudents, unenrollStudent, enrollStudents } from '../action/program_enrollment';
import { fetchInstitutionUser, fetchUserProfile } from '../action/user';

// Styled components
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
  maxWidth: '1200px',
  minHeight: '300px',
}));

const RoundedButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: theme.spacing(1, 4),
}));

const textfieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#C215AE',
    },
    '&:hover fieldset': {
      borderColor: '#C215AE',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C215AE',
    },
  },
};

const ProgramEnrollmentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.user.profile);

  // Get data from location state
  const programId = location.state?.programId || '';
  const programName = location.state?.programName || "Unknown Program";
  const institutionId = location.state?.institutionId;

  // Get data from Redux store
  const { list: enrolledStudents, total, loading, error } = useSelector(state => state.enrollments);

  // Local state
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const [filters, setFilters] = useState({
    email: '',
    firstName: '',
    type: 'student',
  });

  const [sortState, setSortState] = useState({
    column: 'created_at',
    direction: 'desc',
  });

  const [dialogState, setDialogState] = useState({
    open: false,
    searchTerm: '',
    loading: false,
    availableStudents: [],
    selectedStudents: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch enrollments when dependencies change
  useEffect(() => {
    const params = {
      page: pagination.page,
      size: pagination.size,
      sort_column: sortState.column,
      sort_direction: sortState.direction,
      email: filters.email,
      first_name: filters.firstName,
      type: filters.type,
    };
    dispatch(fetchEnrolledStudents(programId, params));
    dispatch(fetchUserProfile())
  }, [pagination, sortState, filters, dispatch, programId]);

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      showSnackbar(error, 'error');
    }
  }, [error]);

  // Handlers
  const handleSort = (column) => {
    setSortState(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({
      page: 1,
      size: parseInt(event.target.value, 10),
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Dialog handlers
  const handleOpenEnrollDialog = async () => {
    setDialogState(prev => ({ ...prev, open: true, loading: true }));
    try {
      const response = await dispatch(fetchInstitutionUser({
        page: 1,
        size: 50,
        user_type: 'student',
        institution_id: institutionId,
        is_program_enrollment: true,
        program_id: programId
      }));
      
      if (response.success) {
        if(response.data.data == null){
          setDialogState(prev => ({ ...prev, loading: false }));
          return
        }
        const filteredStudents = response.data.data.filter(student => 
          !enrolledStudents.some(enrolled => enrolled.id === student.id)
        );
        setDialogState(prev => ({
          ...prev,
          availableStudents: filteredStudents,
          loading: false,
        }));
      } else {
        showSnackbar(response.message || 'Failed to fetch students', 'error');
        setDialogState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to fetch available students', 'error');
      setDialogState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCloseDialog = () => {
    setDialogState({
      open: false,
      searchTerm: '',
      loading: false,
      availableStudents: [],
      selectedStudents: [],
    });
  };

  const handleSearchStudents = async (searchTerm) => {
    setDialogState(prev => ({ ...prev, searchTerm, loading: true }));
    try {
      const response = await dispatch(fetchInstitutionUser(institutionId, {
        page: 1,
        size: 50,
        email: searchTerm,
        type: 'student',
      }));

      if (response.success) {
        const filteredStudents = response.data.data.filter(student => 
          !enrolledStudents.some(enrolled => enrolled.id === student.id)
        );
        setDialogState(prev => ({
          ...prev,
          availableStudents: filteredStudents,
          loading: false,
        }));
      } else {
        showSnackbar(response.message || 'Failed to search students', 'error');
        setDialogState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to search students', 'error');
      setDialogState(prev => ({
        ...prev,
        availableStudents: [],
        loading: false,
      }));
    }
  };

  const handleEnrollStudents = async () => {
    if (dialogState.selectedStudents.length === 0) {
      showSnackbar('Please select at least one student', 'warning');
      return;
    }

    try {
      const response = await dispatch(enrollStudents(programId, dialogState.selectedStudents));
      if (response.success) {
        showSnackbar('Students enrolled successfully');
        handleCloseDialog();
        // Refresh the enrollment list
        dispatch(fetchEnrolledStudents(programId, {
          page: pagination.page,
          size: pagination.size,
          sort_column: sortState.column,
          sort_direction: sortState.direction,
          email: filters.email,
          first_name: filters.firstName,
          type: filters.type,
        }));
      } else {
        showSnackbar(response.message || 'Failed to enroll students', 'error');
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to enroll students', 'error');
    }
  };

  const handleUnenrollStudent = async (studentId) => {
    try {
      const response = await dispatch(unenrollStudent(programId, studentId));
      if (response.success) {
        showSnackbar('Student unenrolled successfully');
        // Refresh the enrollment list
        dispatch(fetchEnrolledStudents(programId, {
          page: pagination.page,
          size: pagination.size,
          sort_column: sortState.column,
          sort_direction: sortState.direction,
          email: filters.email,
          first_name: filters.firstName,
          type: filters.type,
        }));
      } else {
        showSnackbar(response.message || 'Failed to unenroll student', 'error');
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to unenroll student', 'error');
    }
  };

  // Render functions
  const renderEnrolledStudentsTable = () => (
    <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortState.column === 'id'}
                direction={sortState.direction}
                onClick={() => handleSort('id')}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={sortState.column === 'first_name'}
                direction={sortState.direction}
                onClick={() => handleSort('first_name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">Loading...</TableCell>
            </TableRow>
          ) : enrolledStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">No students enrolled</TableCell>
            </TableRow>
          ) : (
            enrolledStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{`${student.user.first_name} ${student.user.last_name}`}</TableCell>
                <TableCell>{student.user.email}</TableCell>
                <TableCell>{student.user.contact_number || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={student.user.is_active ? 'Active' : 'Inactive'}
                    color={student.user.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{student.user.gender || 'N/A'}</TableCell>
                <TableCell align="right">
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleUnenrollStudent(student.id)}
                  >
                    Unenroll
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderEnrollDialog = () => (
    <Dialog
      open={dialogState.open}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: 'white',
          borderRadius: '20px',
        },
      }}
    >
      <DialogTitle sx={{ backgroundColor: '#F8DEF5', color: '#C215AE' }}>
        Enroll New Students
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          fullWidth
          placeholder="Search students by email"
          variant="outlined"
          value={dialogState.searchTerm}
          onChange={(e) => handleSearchStudents(e.target.value)}
          sx={{ ...textfieldStyle, mt: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#C215AE' }} />
              </InputAdornment>
            ),
          }}
        />
        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '20px' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      dialogState.availableStudents.length > 0 &&
                      dialogState.selectedStudents.length === dialogState.availableStudents.length
                    }
                    indeterminate={
                      dialogState.selectedStudents.length > 0 &&
                      dialogState.selectedStudents.length < dialogState.availableStudents.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDialogState(prev => ({
                          ...prev,
                          selectedStudents: prev.availableStudents.map(s => s.id)
                        }));
                      } else {
                        setDialogState(prev => ({ ...prev, selectedStudents: [] }));
                      }
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dialogState.loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Loading...</TableCell>
                </TableRow>
              ) : dialogState.availableStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {dialogState.searchTerm ? 'No students found' : 'No available students'}
                  </TableCell>
                </TableRow>
              ) : (
                dialogState.availableStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={dialogState.selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          setDialogState(prev => ({
                            ...prev,
                            selectedStudents: e.target.checked
                              ? [...prev.selectedStudents, student.id]
                              : prev.selectedStudents.filter(id => id !== student.id)
                          }));
                        }}
                      />
                    </TableCell>
                    <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.contact_number || 'N/A'}</TableCell>
                    <TableCell>{student.gender || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCloseDialog} sx={{ borderRadius: '25px' }}>
          Cancel
        </Button>
        <RoundedButton
          onClick={handleEnrollStudents}
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
        >
          Enroll Selected Students
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );

  return (
    <StyledContainer>
      {/* Breadcrumbs navigation */}
      <Box sx={{ alignSelf: 'flex-start', width: '100%', mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
          {user.user_type === 'institution_admin' && (
            <Link color="inherit" href="/institutions" onClick={(e) => { e.preventDefault(); navigate('/institution'); }}>
              Institutions
            </Link>            
          )}
            <Link color="inherit" href="/program" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
              Programs
            </Link>
            <Typography color="text.primary">{programName}</Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mt: 2 }}>
            Enrollment for {programName}
          </Typography>
        </Box>

      <ContentBox>
        {/* Header section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#C215AE', fontWeight: 'bold' }}>
            Enrolled Students
          </Typography>
          <RoundedButton
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenEnrollDialog}
          >
            Enroll New Students
          </RoundedButton>
        </Box>

        {/* Filters section */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search by email"
            value={filters.email}
            onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
            sx={textfieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#C215AE' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="Search by name"
            value={filters.firstName}
            onChange={(e) => setFilters(prev => ({ ...prev, firstName: e.target.value }))}
            sx={textfieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#C215AE' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Table section */}
        {renderEnrolledStudentsTable()}

        {/* Pagination */}
        <TablePagination
          component="div"
          count={total}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.size}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ mt: 2 }}
        />

        {/* Enroll dialog */}
        {renderEnrollDialog()}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: '25px' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </ContentBox>
    </StyledContainer>
  );
};

export default ProgramEnrollmentPage;