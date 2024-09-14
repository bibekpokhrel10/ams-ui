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
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchUsers, updateUser, changeUserPassword } from '../action/user';

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
  const user = useSelector(state => state.users.user || {});
  const loading = useSelector(state => state.users.loading);
  const error = useSelector(state => state.users.error);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUser, setMenuUser] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

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
        dispatch(fetchUsers());
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

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
    handleMenuClose();
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setSelectedUserId(null);
  };

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
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mb: 3, textAlign: 'center' }}>
          Users
        </Typography>
        <ContentBox>
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
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {`${user.first_name} ${user.last_name}`}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
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
        <MenuItem onClick={() => handleUserClick(menuUser)}>
          <PersonIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleOpenPasswordDialog}>
          <EditIcon sx={{ mr: 1 }} />
          Change Password
        </MenuItem>
      </Menu>

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