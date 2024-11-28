import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Switch,
  TablePagination,
  TableSortLabel,
  Select,
  FormControl,
  InputLabel,
  DialogContentText,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  fetchUsers, 
  updateUser, 
  updateUserType,
  changeUserPassword, 
  deleteUser
} from '../action/user';
import { fetchInstitutions } from '../action/institution';
import { fetchPrograms } from '../action/program';
import { useParams } from 'react-router-dom';


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

const User = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users || []);
  const userProfile = useSelector(state => state.users.profile);
  const totalUsers = useSelector(state => state.users.list || 0);
  const pagination = useSelector(state => state.users.pagination || {});
  const loading = useSelector(state => state.users.loading);
  const error = useSelector(state => state.users.error);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUser, setMenuUser] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('');
  const  paramId = useParams();

  useEffect(() => {
    if(userProfile.user_type === 'super_admin'){
    dispatch(fetchUsers());
    }
    dispatch(fetchInstitutions()).then(response => {
      if (response.success) {
        setInstitutions(response.data.data);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (selectedInstitution) {
      dispatch(fetchPrograms(selectedInstitution)).then(response => {
        if (response.success) {
          setPrograms(response.data);
        }
      });
    }
  }, [selectedInstitution, dispatch]);

  useEffect(() => {
    if(userProfile.user_type === 'super_admin'){
    dispatch(fetchUsers());
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPaginatedUsers();
  }, [dispatch, page, rowsPerPage, sortColumn, sortDirection, searchTerm]);

  const fetchPaginatedUsers = () => {
    
    const listRequest = {
      page: page + 1,
      size: rowsPerPage,
      sort_column: sortColumn,
      sort_direction: sortDirection,
      query: searchTerm,
     
    };

    if(paramId != null && paramId.id != null && paramId.id != undefined){
      listRequest.institution_id = paramId.id
    }
   
    dispatch(fetchUsers(listRequest));
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleNextPage = () => {
    if (page < Math.ceil(pagination.total / rowsPerPage) - 1) {
      setPage(page + 1);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setOpenDetailsDialog(true);
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(user.id);
    setMenuUser(user); 
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUser(null);
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      const response = await dispatch(updateUser(userId, { is_active: !isActive }));
      console.log(response);
      if (response.success) {
        setSnackbarMessage('User status updated successfully!');
        setSnackbarSeverity('success');
        fetchPaginatedUsers();
      } else {
        throw new Error(response.message || 'Failed to update user status');
      }
    } catch (error) {
      setSnackbarMessage(error.message || 'An error occurred. Please try again.');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
    handleMenuClose();
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUserTypeDialog, setOpenUserTypeDialog] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');

  // Updated function to check if current user can manage user types
  const canManageUserTypes = (targetUser) => {
    if (!userProfile || !userProfile.user_type) return false;
    
    if (userProfile.user_type === 'super_admin') {
      return true;
    }
    if (userProfile.user_type === 'institution_admin' && targetUser.user_type !== 'institution_admin') {
      return true;
    }
    return false;
  };

  // Updated function to get available user types based on admin role
  const getAvailableUserTypes = () => {
    if (!userProfile || !userProfile.user_type) return [];
    
    if (userProfile.user_type === 'super_admin') {
      return [ 'institution_admin', 'teacher', 'student'];
    }
    if (userProfile.user_type === 'institution_admin') {
      return [ 'teacher', 'student'];
    }
    return [];
  };

  const renderMenuItems = (user) => {
    
    if (!userProfile || !userProfile.user_type) return null;

    return (
      <>
        <MenuItem onClick={() => handleUserClick(user)}>
          <PersonIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleOpenPasswordDialog}>
          <EditIcon sx={{ mr: 1 }} />
          Change Password
        </MenuItem>
        {canManageUserTypes(user) && (
          <MenuItem onClick={() => {
            setSelectedUserType(user.user_type);
            setOpenUserTypeDialog(true);
            handleMenuClose();
          }}>
            <ManageAccountsIcon sx={{ mr: 1 }} />
            Change User Type
          </MenuItem>
        )}
        {(userProfile.user_type === 'super_admin' || userProfile.user_type === 'institution_admin') && (
          <MenuItem onClick={() => {
            setOpenDeleteDialog(true);
            handleMenuClose();
          }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete User
          </MenuItem>
        )}
      </>
    );
  };


    // Handle user type change
    const handleUserTypeChange = async () => {
      try {
        const updateData = {
          user_type: selectedUserType,
        };
  
        if (selectedUserType === 'institution_admin') {
          // if (!selectedInstitution) {
          //   throw new Error('Please select an institution');
          // }
          updateData.institution_id = selectedInstitution;
        }
  
        const response = await dispatch(updateUserType(selectedUserId, updateData));
        if (response.success) {
          setSnackbarMessage('User type updated successfully!');
          setSnackbarSeverity('success');
          fetchPaginatedUsers();
        } else {
          throw new Error(response.message || 'Failed to update user type');
        }
      } catch (error) {
        setSnackbarMessage(error.message || 'An error occurred. Please try again.');
        setSnackbarSeverity('error');
      }
      setOpenSnackbar(true);
      setOpenUserTypeDialog(false);
    };

  // Handle user deletion
  const handleDeleteUser = async () => {
    try {
      const response = await dispatch(deleteUser(selectedUserId));
      if (response.success) {
        setSnackbarMessage('User deleted successfully!');
        setSnackbarSeverity('success');
        fetchPaginatedUsers();
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      setSnackbarMessage(error.message || 'An error occurred. Please try again.');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
    setOpenDeleteDialog(false);
    handleMenuClose();
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
    handleMenuClose();
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setSelectedUserId(null);
  };

  const renderTableHeader = () => (
    <Box sx={{ display: 'flex', mb: 2, gap: 2, width: '100%' }}>
      <TextField
        variant="outlined"
        placeholder="Search"
        size="small"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ ...textfieldStyle, flexGrow: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#C215AE' }} />
            </InputAdornment>
          ),
        }}
      />
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Institution</InputLabel>
        <Select
          value={filterInstitution}
          onChange={(e) => {
            setFilterInstitution(e.target.value);
            setPage(0);
          }}
          label="Institution"
          size="small"
        >
          <MenuItem value="">All Institutions</MenuItem>
          {institutions.map((institution) => (
            <MenuItem key={institution.id} value={institution.id}>
              {institution.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const renderUserTypeDialog = () => (
    <Dialog
      open={openUserTypeDialog}
      onClose={() => setOpenUserTypeDialog(false)}
      PaperProps={{
        style: {
          backgroundColor: '#F8DEF5',
          borderRadius: '20px',
        },
      }}
    >
      <DialogTitle>Change User Type</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>User Type</InputLabel>
          <Select
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
            label="User Type"
          >
            {getAvailableUserTypes().map((type) => (
              <MenuItem key={type} value={type}>
                {type.replace('_', ' ').toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedUserType === 'institution_admin' && userProfile.user_type === 'super_admin' && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Institution</InputLabel>
            <Select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              label="Institution"
            >
              {institutions.map((institution) => (
                <MenuItem key={institution.id} value={institution.id}>
                  {institution.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenUserTypeDialog(false)}>Cancel</Button>
        <RoundedButton
          onClick={handleUserTypeChange}
          variant="contained"
          sx={{ backgroundColor: '#C215AE', color: 'white', '&:hover': { backgroundColor: '#9E1188' } }}
        >
          Update User Type
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );

  const renderTableColumns = () => (
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
            active={sortColumn === 'email'}
            direction={sortColumn === 'email' ? sortDirection : 'asc'}
            onClick={() => handleSort('email')}
          >
            Email
          </TableSortLabel>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>
          <TableSortLabel
            active={sortColumn === 'user_type'}
            direction={sortColumn === 'user_type' ? sortDirection : 'asc'}
            onClick={() => handleSort('user_type')}
          >
            User Type
          </TableSortLabel>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>Institution</TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>
          <TableSortLabel
            active={sortColumn === 'is_active'}
            direction={sortColumn === 'is_active' ? sortDirection : 'asc'}
            onClick={() => handleSort('is_active')}
          >
            Status
          </TableSortLabel>
        </TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
    </TableHead>
  );

  const passwordFormik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().required('Required').min(8, 'Password must be at least 8 characters'),
      confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!selectedUserId) {
          throw new Error('No user selected');
        }
        const updateUserPasswordPayload = {
          new_password: values.newPassword,
          confirm_password: values.confirmPassword,
        }
        const response = await dispatch(changeUserPassword(selectedUserId, updateUserPasswordPayload));
        if (response.success) {
          setSnackbarMessage('Password changed successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          handleClosePasswordDialog();
          resetForm();
        } else {
          throw new Error(response.message || 'Failed to change password');
        }
      } catch (error) {
        setSnackbarMessage(error.message || 'An error occurred. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const safeUsers = Array.isArray(users) ? users : [];
  
  const filteredUsers = safeUsers.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
  <StyledContainer>
  <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
    <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mb: 3, alignSelf: 'flex-start' }}>
      Users
    </Typography>
    <ContentBox>
      {renderTableHeader()}
      <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          {renderTableColumns()}
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_type}</TableCell>
                <TableCell>{user.institution?.name || '-'}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.is_active}
                    onChange={() => handleToggleActive(user.id, user.is_active)}
                    color="primary"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(event) => handleMenuOpen(event, user)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <TablePagination
              component="div"
              count={pagination.total || 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`}
              SelectProps={{
                native: true,
              }}
            />
          </Box>
        </ContentBox>
      </Container>

      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: '#F8DEF5',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle>{`${selectedUser?.firstName} ${selectedUser?.lastName}`}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> {selectedUser?.email}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Role:</strong> {selectedUser?.role}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Status:</strong> {selectedUser?.isActive ? 'Active' : 'Inactive'}
          </Typography>
          <Typography variant="body1">
            <strong>Created at:</strong> {formatDate(selectedUser?.createdAt)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

           <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {menuUser && renderMenuItems(menuUser)}
      </Menu>

      {/* Add User Type Dialog */}
      <Dialog
        open={openUserTypeDialog}
        onClose={() => setOpenUserTypeDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: '#F8DEF5',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle>Change User Type</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>User Type</InputLabel>
            <Select
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              label="User Type"
            >
              {getAvailableUserTypes().map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserTypeDialog(false)}>Cancel</Button>
          <RoundedButton
            onClick={handleUserTypeChange}
            variant="contained"
            sx={{ backgroundColor: '#C215AE', color: 'white', '&:hover': { backgroundColor: '#9E1188' } }}
          >
            Update User Type
          </RoundedButton>
        </DialogActions>
      </Dialog>

      {/* Add Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: '#F8DEF5',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <RoundedButton
            onClick={handleDeleteUser}
            variant="contained"
            sx={{ backgroundColor: '#C215AE', color: 'white', '&:hover': { backgroundColor: '#9E1188' } }}
          >
            Delete
          </RoundedButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPasswordDialog}
        onClose={handleClosePasswordDialog}
        PaperProps={{
          style: {
            backgroundColor: '#F8DEF5',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="newPassword"
            name="newPassword"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordFormik.values.newPassword}
            onChange={passwordFormik.handleChange}
            error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
            helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
            sx={textfieldStyle}
          />
          <TextField
            margin="dense"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordFormik.values.confirmPassword}
            onChange={passwordFormik.handleChange}
            error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
            helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
            sx={textfieldStyle}
          />
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClosePasswordDialog}>Cancel</Button>
        <RoundedButton
          onClick={passwordFormik.handleSubmit}
          variant="contained"
          sx={{ backgroundColor: '#C215AE', color: 'white', '&:hover': { backgroundColor: '#9E1188' } }}
        >
          Change Password
        </RoundedButton>
      </DialogActions>
    </Dialog>

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

export default User;