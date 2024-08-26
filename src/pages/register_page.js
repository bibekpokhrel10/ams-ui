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

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    contact_no: Yup.string().matches(/^\d{10}$/, 'Must be exactly 10 digits').required('Required'),
    first_name: Yup.string().required('Required'),
    last_name: Yup.string().required('Required'),
    user_type: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    date_of_birth: Yup.date().required('Required'),
    gender: Yup.string().required('Required'),
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
      confirm_password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const registerUserPayload = {
        email: values.email,
        name: values.first_name,
        last_name: values.last_name,
        contact_no: values.contact_no,
        address: values.address,
        date_of_birth: values.date_of_birth,
        gender: values.gender,
        user_type: values.user_type,
        password: values.password,
        confirm_password: values.confirm_password
      };
      try {
        const response = await dispatch(registerAPI(registerUserPayload));
        console.log("this is response :: ",response.data.message)
        if (response.data.message=="Success") {
          setSnackbarMessage('Registration successful!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          resetForm();
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setSnackbarMessage(response.error || 'Registration failed. Please try again.');
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
          background: 'linear-gradient(180deg, #A6539C 0%, rgba(166, 83, 156, 0.7) 100%)'
        }}
      >
      <Container component="main" maxWidth="md"
      sx = {{
        height: '500px',
        width: '100%',
        borderRadius: '50px',
        backgroundColor: '#F8DEF5',
      }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
         {/* <Avatar sx={{ backgroundColor: '#C215AE', marginTop: 1 }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
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
  </Grid>
  <Grid container justifyContent="center" mt={1}>
              <Grid item>
                <Link href="/login" variant="body2" sx={{ color: '#C215AE' }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>   
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 2,
                    borderRadius: '50px',
                    width: '30%',
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
