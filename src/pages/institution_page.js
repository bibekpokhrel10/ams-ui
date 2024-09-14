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
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchInstitutions, createInstitution, deleteInstitution } from '../action/institution';

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
  const institutions = useSelector(state => state.institutions.list || []);
  const loading = useSelector(state => state.institutions.loading);
  const error = useSelector(state => state.institutions.error);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuInstitution, setMenuInstitution] = useState(null);

  useEffect(() => {
    dispatch(fetchInstitutions());
  }, [dispatch]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleInstitutionClick = (institution) => {
    navigate(`/institutions/${institution.id}/programs`, { state: { institutionName: institution.name, institutionId: institution.id } });
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

  const handleDeleteInstitution = async () => {
    try {
      const response = await dispatch(deleteInstitution(menuInstitution.id));
      if (response.success) {
        setSnackbarMessage('Institution deleted successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        dispatch(fetchInstitutions());
      } else {
        throw new Error(response.message || 'Failed to delete institution');
      }
    } catch (error) {
      setSnackbarMessage(error.message || 'An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    handleMenuClose();
  };

  const formik = useFormik({
    initialValues: {
      institutionName: '',
    },
    validationSchema: Yup.object({
      institutionName: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const institutionPayload = {
          name: values.institutionName,
        }
        const response = await dispatch(createInstitution(institutionPayload));
        if (response.success) {
          setSnackbarMessage('Institution created successfully!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setOpenDialog(false);
          resetForm();
          dispatch(fetchInstitutions());
        } else {
          throw new Error(response.message || 'Failed to create institution');
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

  const safeInstitutions = Array.isArray(institutions) ? institutions : [];

  const filteredInstitutions = safeInstitutions.filter(institution =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StyledContainer>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mb: 3, textAlign: 'left' }}>
          Institution
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
            <RoundedButton
              variant="contained"
              onClick={() => setOpenDialog(true)}
              sx={{ backgroundColor: '#C215AE', color: 'white', '&:hover': { backgroundColor: '#9E1188' } }}
            >
              CREATE
            </RoundedButton>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="institutions table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created at</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInstitutions.map((institution) => (
                  <TableRow
                    key={institution.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                    onClick={() => handleInstitutionClick(institution)}
                  >
                    <TableCell component="th" scope="row">
                      {institution.name}
                    </TableCell>
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon sx={{ color: '#C215AE' }} />
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteInstitution}>
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

export default Institution;