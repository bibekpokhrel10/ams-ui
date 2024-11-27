import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  TablePagination,
  TableSortLabel,
  CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchInstitutions, createInstitution, deleteInstitution } from '../action/institution';
import { fetchInstitutionAdmins, addInstitutionAdmin } from '../action/institution_admin';
import { fetchUsers } from '../action/user';

// Styled components remain the same
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

const Institution = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state selectors with safe fallbacks
  const institutions = useSelector(state => state.institutions?.list || []);
  const pagination = useSelector(state => state.institutions?.pagination || { total: 0 });
  const loading = useSelector(state => state.institutions?.loading || false);
  const error = useSelector(state => state.institutions?.error);
  const admins = useSelector(state => state.institutionAdmins?.admins || []);
  const users = useSelector(state => state.users?.list || []);
  const usersLoading = useSelector(state => state.users?.loading || false);
  const adminsLoading = useSelector(state => state.institutionAdmins?.loading || false);

  // Local state
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuInstitution, setMenuInstitution] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(null);
  const [adminPage, setAdminPage] = useState(0);
  const [adminRowsPerPage, setAdminRowsPerPage] = useState(10);

  // Form validation schema
  const validationSchema = Yup.object({
    institutionName: Yup.string()
      .required('Institution name is required')
      .min(2, 'Institution name must be at least 2 characters')
      .max(100, 'Institution name must not exceed 100 characters')
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      institutionName: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await dispatch(createInstitution({ name: values.institutionName }));
        if (response.success) {
          showSnackbar('Institution created successfully!', 'success');
          setOpenDialog(false);
          resetForm();
          fetchPaginatedInstitutions();
        } else {
          throw new Error(response.message || 'Failed to create institution');
        }
      } catch (error) {
        showSnackbar(error.message || 'An error occurred while creating the institution', 'error');
      }
    },
  });

  // Effect to fetch initial data
  useEffect(() => {
    fetchPaginatedInstitutions();
  }, [dispatch, page, rowsPerPage, sortColumn, sortDirection, searchTerm]);

  // Helper functions
  const fetchPaginatedInstitutions = () => {
    const listRequest = {
      page: page + 1,
      size: rowsPerPage,
      sort_column: sortColumn,
      sort_direction: sortDirection,
      query: searchTerm,
    };
    dispatch(fetchInstitutions(listRequest));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleInstitutionClick = (institution) => {
    navigate(`/institutions/${institution.id}/programs`, {
      state: { institutionName: institution.name, institutionId: institution.id }
    });
  };

  const handleMenuOpen = (event, institution) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuInstitution(institution);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuInstitution(null);
  };

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

  const handleDeleteInstitution = async () => {
    try {
      const response = await dispatch(deleteInstitution(menuInstitution.id));
      if (response.success) {
        showSnackbar('Institution deleted successfully!');
        fetchPaginatedInstitutions();
      } else {
        throw new Error(response.message || 'Failed to delete institution');
      }
    } catch (error) {
      showSnackbar(error.message || 'An error occurred while deleting the institution', 'error');
    }
    handleMenuClose();
  };

  const handleOpenAdminDialog = (institutionId) => {
    setSelectedInstitutionId(institutionId);
    setOpenAdminDialog(true);
    dispatch(fetchInstitutionAdmins(institutionId, {
      page: adminPage + 1,
      size: adminRowsPerPage
    }));
    dispatch(fetchUsers());
    handleMenuClose();
  };

  const handleAddAdmin = async (userId) => {
    try {
      const response = await dispatch(addInstitutionAdmin(selectedInstitutionId, userId));
      if (response.success) {
        showSnackbar('Institution admin added successfully!');
        dispatch(fetchInstitutionAdmins(selectedInstitutionId, {
          page: adminPage + 1,
          size: adminRowsPerPage
        }));
      } else {
        throw new Error(response.message || 'Failed to add institution admin');
      }
    } catch (error) {
      showSnackbar(error.message || 'An error occurred while adding the admin', 'error');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render loading state
  if (loading) {
    return (
      <StyledContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress sx={{ color: '#C215AE' }} />
        </Box>
      </StyledContainer>
    );
  }

  // Render error state
  if (error) {
    return (
      <StyledContainer>
        <Alert severity="error" sx={{ width: '100%', maxWidth: '900px' }}>
          {error}
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mb: 3, alignSelf: 'flex-start' }}>
          Institution
        </Typography>
        
        <ContentBox>
          {/* Search and Create button */}
          <Box sx={{ display: 'flex', mb: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ ...textfieldStyle, flexGrow: 1, mr: 2 }}
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
              sx={{ backgroundColor: '#C215AE', color: 'white', '&:hover': { backgroundColor: '#9E1188' } }}
            >
              CREATE
            </RoundedButton>
          </Box>

          {/* Institutions Table */}
          <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }} aria-label="institutions table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={sortColumn === 'id'}
                      direction={sortColumn === 'id' ? sortDirection : 'asc'}
                      onClick={() => handleSort('id')}
                    >
                      SN
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
                {institutions.map((institution, index) => (
                  <TableRow
                    key={institution.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                    onClick={() => handleInstitutionClick(institution)}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{institution.name}</TableCell>
                    <TableCell>{formatDate(institution.created_at)}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleMenuOpen(event, institution)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <TablePagination
              component="div"
              count={pagination.total || 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelDisplayedRows={({ from, to, count }) => 
                `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
              }
            />
          </Box>
        </ContentBox>
      </Container>

      {/* Create Institution Dialog */}
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
        <DialogTitle>Create Institution</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="institutionName"
            name="institutionName"
            label="Institution Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formik.values.institutionName}
            onChange={formik.handleChange}
            error={formik.touched.institutionName && Boolean(formik.errors.institutionName)}
            helperText={formik.touched.institutionName && formik.errors.institutionName}
            sx={textfieldStyle}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#C215AE' }}>
            Cancel
          </Button>
          <Button onClick={formik.handleSubmit} sx={{ color: '#C215AE' }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Institution Admin Dialog */}
      <Dialog
        open={openAdminDialog}
        onClose={() => setOpenAdminDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#F8DEF5',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle>Manage Institution Admins</DialogTitle>
        <DialogContent>
          {/* Current Admins Table */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Current Admins</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: '20px', mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Added Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminsLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress size={24} sx={{ color: '#C215AE' }} />
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{formatDate(admin.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add New Admin Section */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Add New Admin</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: '20px' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress size={24} sx={{ color: '#C215AE' }} />
                    </TableCell>
                  </TableRow>
                ) : (
                  users
                    .filter(user => !admins.some(admin => admin.id === user.id))
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAddAdmin(user.id)}
                            sx={{
                              backgroundColor: '#C215AE',
                              color: 'white',
                              '&:hover': { backgroundColor: '#9E1188' }
                            }}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdminDialog(false)} sx={{ color: '#C215AE' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleOpenAdminDialog(menuInstitution?.id)}>
          <PersonIcon sx={{ mr: 1 }} />
          Manage Admins
        </MenuItem>
        <MenuItem onClick={handleDeleteInstitution} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default Institution;