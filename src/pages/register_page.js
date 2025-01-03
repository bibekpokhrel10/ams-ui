import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { DashBoard } from './dashboard';
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import  { useEffect, useState } from "react";
import { registerAPI } from '../action/auth';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FormHelperText } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchInstitutions } from '../action/institution';

const apiUrl = 'http://localhost:8080/register';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export function RegisterPage() {
  const dispatch = useDispatch();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadInstitutions = async () => {
      setLoading(true);
      try {
        const response = await dispatch(fetchInstitutions());
        console.log('Institutions API response:', response.data.data); // Debug log
        
        if (response.success && Array.isArray(response.data.data)) {
          setInstitutions(response.data.data);
        } else if (response.success && !Array.isArray(response.data.data)) {
          console.error('Institution data is not an array:', response.data.data);
          setInstitutions([]);
          setError('Invalid institution data format');
        } else {
          console.error('Failed to load institutions:', response);
          setInstitutions([]);
          setError(response.message || 'Failed to load institutions');
        }
      } catch (error) {
        console.error('Error loading institutions:', error);
        setInstitutions([]);
        setError('Failed to load institutions');
      } finally {
        setLoading(false);
      }
    };
    loadInstitutions();
  }, [dispatch]);


  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    contact_no: Yup.string().matches(/^\d{10}$/, 'Must be exactly 10 digits').required('Required'),
    first_name: Yup.string().required('Required'),
    last_name: Yup.string().required('Required'),
    user_type: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    date_of_birth: Yup.date().required('Required'),
    gender: Yup.string().required('Required'),
    institution_id: Yup.string().required('Required'),
    password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  const navigate = useNavigate();
const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const formik = useFormik({
    initialValues: {
      email: '',
      contact_no: '',
      first_name: '',
      last_name: '',
      user_type: '',
      address: '',
      date_of_birth: '',
      gender: '',
      password: '',
      confirm_password: '',
      institution_id: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const registerUserPayload = {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        contact_no: values.contact_no,
        address: values.address,
        date_of_birth: values.date_of_birth,
        gender: values.gender,
        user_type: values.user_type,
        password: values.password,
        confirm_password: values.confirm_password,
        institution_id: values.institution_id
      };
      try {
        const response = await dispatch(registerAPI(registerUserPayload));
        if (response.success) {
          setSnackbarMessage('Registration successful!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          resetForm();
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setSnackbarMessage(response.message || 'Registration failed. Please try again.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage('An error occurred. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const ellipseSelectStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      height: '45px',
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
        paddingLeft: '20px',
        fontSize: '1rem',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '1rem',
      '&:not(.MuiInputLabel-shrink)': {
        transform: 'translate(20px, 8px) scale(1)',
      },
      '&.Mui-focused': {
        color: '#C215AE',
      },
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -1px) scale(0.7)',
    },
    '& .MuiSelect-icon': {
      right: '12px',
    },
    backgroundColor: 'white',
    borderRadius: '25px',
  };


  const textfieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      height: '45px',
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
        paddingLeft: '20px',
        fontSize: '1rem',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '1rem',
      '&:not(.MuiInputLabel-shrink)': {
        transform: 'translate(20px, 8px) scale(1)',
      },
      '&.Mui-focused': {
        color: '#C215AE',
      },
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -1px) scale(0.7)',
    },
    '& .MuiFormHelperText-root': {
      position: 'absolute',
      bottom: '-20px',
      marginLeft: '14px', // Aligns with the input padding
    },
    backgroundColor: 'white',
    borderRadius: '25px',
  };

  const StyledMenuItem = styled(MenuItem)({
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#C215AE', // Change this to your preferred hover color
    },
  });

  const gridItemStyle = {
    marginBottom: '13px', // Adjust this value as needed
    position: 'relative',
  };

  return (
    <ThemeProvider theme={defaultTheme}>
       <Box 
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #A6539C 0%, rgba(166, 83, 156, 0.7) 100%)',
          overflow: 'auto', // Added to handle potential overflow
          padding: '20px 0' // Added to give some breathing room
        }}
      >
      <Container component="main" maxWidth="md"
      sx = {{
        height: 'auto', // Changed from fixed height to auto
        minHeight: '500px', // Minimum height maintained
        width: '100%',
        borderRadius: '50px',
        backgroundColor: '#F8DEF5',
        padding: '20px', // Added padding
        boxSizing: 'border-box', // Ensures padding is included in width calculation
      }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Register
          </Typography>
          <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ 
            width: '100%', 
            maxWidth: '800px', // Limit maximum width
            px: 2 // Add horizontal padding
          }}>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
    <Grid item xs={4.5} mr={5} sx={gridItemStyle}>
      <TextField
        name="email"
        required
        fullWidth
        id="email"
        label="Email Address"
        sx={textfieldStyle}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.onBlur}
        error={Boolean(formik.errors.email)}
        helperText={formik.errors.email}
      />
    </Grid>
    <Grid item xs={4.5} ml={5} sx={gridItemStyle}>
      <TextField
        name="contact_no"
        required
        fullWidth
        id="contact_no"
        label="Contact No."
        sx={textfieldStyle}
        value={formik.values.contact_no}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.contact_no)}
        helperText={formik.errors.contact_no}        
      />
    </Grid>
    <Grid item xs={4.5} mr={5} sx={gridItemStyle}>
      <TextField
        name="first_name"
        required
        fullWidth
        id="first_name"
        label="First Name"
        sx={textfieldStyle}
        value={formik.values.first_name}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.first_name)}
        helperText={formik.errors.first_name}
      />
    </Grid>
    <Grid item xs={4.5} ml={5} sx={gridItemStyle}>
      <TextField
        name="last_name"
        required
        fullWidth
        id="last_name"
        label="Last Name"
        sx={textfieldStyle}
        value={formik.values.last_name}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.last_name)}
        helperText={formik.errors.last_name}
      />
    </Grid>
    <Grid item xs={4.5} mr={5}>
      <FormControl fullWidth required sx={ellipseSelectStyle} error={formik.errors.user_type && Boolean(formik.errors.user_type)}>
        <InputLabel id="user_type">Type</InputLabel>
        <Select  
          labelId="user_type"
          id="user_type"
          label="Type"
          name="user_type"
          IconComponent={ArrowDropDownIcon}
          value={formik.values.user_type}
          onChange={formik.handleChange}
          sx={{
            '& .MuiSelect-select': {
              paddingLeft: '36px !important',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '30px',
                marginTop: '8px',
                border: '1px solid rgba(0, 0, 0, 0.23)',
              },
            },
          }}
        >
          <StyledMenuItem value="teacher">teacher</StyledMenuItem>
          <StyledMenuItem value="student">student</StyledMenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={4.5} ml={5} sx={gridItemStyle}>
      <TextField
        sx={textfieldStyle}
        required
        fullWidth
        id="address"
        label="Address"
        name="address"
        value={formik.values.address}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.address)}
        helperText={formik.errors.address}
      />
    </Grid>
    <Grid item xs={4.5} mr={5} sx={gridItemStyle}>
      <TextField
          sx={{
            ...textfieldStyle,
            '& .MuiInputLabel-root': {
              ...textfieldStyle['& .MuiInputLabel-root'],
              transform: 'translate(14px, -9px) scale(0.75)',
            },
            '& .MuiInputLabel-shrink': {
              transform: 'translate(14px, -4px) scale(0.75)',
            },
          }}
        required
        fullWidth
        name="date_of_birth"
        label="Date of Birth"
        placeholder="Date of Birth"
        InputLabelProps={{
          shrink: true,
        }}
        type="date"
        id="date_of_birth"
        value={formik.values.date_of_birth}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.date_of_birth)}
        helperText={formik.errors.date_of_birth}
      />
    </Grid>
    <Grid item xs={4.5} ml={5}>
      <FormControl fullWidth required sx={ellipseSelectStyle} error={formik.touched.gender && Boolean(formik.errors.gender)}>
        <InputLabel id="gender">Gender</InputLabel>
        <Select  
          labelId="gender"
          id="gender"
          label="Gender"
          name="gender"
          value={formik.values.gender}
          onChange={formik.handleChange}
          IconComponent={ArrowDropDownIcon}
    sx={{
      '& .MuiSelect-select': {
        paddingLeft: '36px !important',
      },
    }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '30px',
                marginTop: '8px',
                border: '1px solid rgba(0, 0, 0, 0.23)',
              },
            },
          }}
        >
          <StyledMenuItem value="male">Male</StyledMenuItem>
          <StyledMenuItem value="female">Female</StyledMenuItem>
          <StyledMenuItem value="others">Others</StyledMenuItem>
        </Select>
        {formik.touched.gender && formik.errors.gender && (
      <FormHelperText>{formik.errors.gender}</FormHelperText>
    )}
      </FormControl>
    </Grid>
    <Grid item xs={4.5} mr={5} sx={gridItemStyle}>
      <TextField
        sx={textfieldStyle}
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.password)}
        helperText={formik.errors.password}
      />
    </Grid>
    <Grid item xs={4.5} ml={5} sx={gridItemStyle}>
      <TextField
        sx={textfieldStyle}
        required
        fullWidth
        name="confirm_password"
        label="Confirm Password"
        type="password"
        id="confirm_password"
        value={formik.values.confirm_password}
        onChange={formik.handleChange}
        error={Boolean(formik.errors.confirm_password)}
        helperText={formik.errors.confirm_password}
      />
    </Grid>
    <Grid item xs={4.5} mr={5}>
        <FormControl fullWidth required sx={ellipseSelectStyle} error={formik.touched.institution_id && Boolean(formik.errors.institution_id)}>
          <InputLabel id="institution_id">Institution</InputLabel>
          <Select
            labelId="institution_id"
            id="institution_id"
            label="Institution"
            name="institution_id"
            IconComponent={ArrowDropDownIcon}
            value={formik.values.institution_id}
            onChange={formik.handleChange}
            disabled={loading}
            sx={{
              '& .MuiSelect-select': {
                paddingLeft: '36px !important',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '30px',
                  marginTop: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                },
              },
            }}
          >
            {loading ? (
              <StyledMenuItem disabled>Loading institutions...</StyledMenuItem>
            ) : error ? (
              <StyledMenuItem disabled>{error}</StyledMenuItem>
            ) : institutions.length === 0 ? (
              <StyledMenuItem disabled>No institutions available</StyledMenuItem>
            ) : (
              institutions.map((institution) => (
                <StyledMenuItem key={institution.id} value={institution.id}>
                  {institution.name}
                </StyledMenuItem>
              ))
            )}
          </Select>
          {formik.touched.institution_id && formik.errors.institution_id && (
            <FormHelperText>{formik.errors.institution_id}</FormHelperText>
          )}
        </FormControl>
      </Grid>
  </Grid>
  <Grid container justifyContent="center" mt={1}>
              <Grid item>
                <Link href="/login" variant="body2" sx={{ color: '#C215AE' }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>   
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              width: '100%', 
              mt: 2 // Added margin top
            }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: '50px',
                  width: '200px', // Fixed width instead of percentage
                  backgroundColor: '#C215AE',
                  '&:hover': {
                    backgroundColor: 'purple',
                  },
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
      </Box>
      <Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>
    </ThemeProvider>
  );
}
