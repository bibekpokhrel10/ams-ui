import * as React from 'react';
import { useState, useEffect } from "react";
import { loginAPI } from "../action/auth";
import { fetchInstitutions } from '../action/institution';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useDispatch } from "react-redux";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Container from '@mui/material/Container';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SupervisedUserCircleTwoToneIcon from '@mui/icons-material/SupervisedUserCircleTwoTone';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Snackbar, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const StyledMenuItem = styled(MenuItem)({
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#C215AE',
  },
});

const defaultTheme = createTheme();

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadInstitutions = async () => {
      setLoading(true);
      try {
        const response = await dispatch(fetchInstitutions());
        if (response.success && Array.isArray(response.data.data)) {
          setInstitutions(response.data.data);
        } else {
          setInstitutions([]);
          setError('Failed to load institutions');
        }
      } catch (error) {
        setInstitutions([]);
        setError('Failed to load institutions');
      } finally {
        setLoading(false);
      }
    };
    loadInstitutions();
  }, [dispatch]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      type: 'student',
      institution_id: 0,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
      type: Yup.string().required('Required'),
      institution_id: Yup.string().when('type', {
        is: (val) => val !== 'super_admin',
        then: () => Yup.string().required('Required'),
        otherwise: () => Yup.string()
      })
    }),
    onSubmit: async (values) => {
      const loginUserPayload = {
        email: values.email,
        password: values.password,
        user_type: values.type,
        institution_id: values.institution_id,
      };
      try {
        const response = await dispatch(loginAPI(loginUserPayload));
        if (response.success) {
          setSnackbarMessage('Login successful!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          setSnackbarMessage(response.message || 'Login failed. Please try again.');
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

  const filteredInstitutions = institutions.filter(institution =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      '&:not(.MuiInputLabel-shrink)': {
        transform: 'translate(40px, 16px) scale(1)',
      },
      '&.Mui-focused': {
        color: '#C215AE',
      },
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
    },
    '& .MuiInputAdornment-root': {
      position: 'absolute',
      left: '14px',
    },
    backgroundColor: 'white',
    borderRadius: '50px',
  };

  const ellipseSelectStyle = {
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
    },
    '& .MuiInputLabel-root': {
      left: '40px',
      '&.Mui-focused': {
        color: '#C215AE',
      },
      '&.MuiInputLabel-shrink': {
        transform: 'translate(-26px, -6px) scale(0.75)',
      },
    },
    '& .MuiSelect-icon': {
      right: '12px',
    },
    '& .MuiInputAdornment-root': {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    },
    backgroundColor: 'white',
    borderRadius: '50px',
  };

  const StyledMenuItem = styled(MenuItem)({
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#C215AE',
    },
  });

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
        <Container component="main" maxWidth="xs"
          sx={{
            height: '600px',
            width: '100%',
            borderRadius: '50px',
            backgroundColor: '#F8DEF5',
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
          >
            <Avatar sx={{ backgroundColor: '#C215AE', marginTop: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{}}>
              <Box sx={{ height: '70px', position: 'relative', marginBottom: '10px' }}>
                <TextField
                  sx={{
                    ...textfieldStyle,
                    '& .MuiFormHelperText-root': {
                      position: 'absolute',
                      bottom: '-20px',
                    },
                  }}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  placeholder="Email Address"
                  name="email"
                  autoComplete="email"
                  label="Email Address"
                  autoFocus
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon sx={{color:'#C215AE'}}/>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ height: '70px', position: 'relative', marginBottom: '10px' }}>
                <TextField
                  sx={{
                    ...textfieldStyle,
                    '& .MuiFormHelperText-root': {
                      position: 'absolute',
                      bottom: '-20px',
                    },
                  }}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  placeholder='Password'
                  id="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{color:'#C215AE'}}/>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ height: '70px', position: 'relative', marginBottom: '10px', width: '100%' }}>
                <FormControl fullWidth margin="normal" sx={ellipseSelectStyle}>
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    label="Type"
                    required
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    IconComponent={ArrowDropDownIcon}
                    sx={{
                      '& .MuiSelect-select': {
                        paddingLeft: '36px !important',
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="start" sx={{ position: 'absolute', left: 8 }}>
                        <SupervisedUserCircleTwoToneIcon sx={{color:'#C215AE'}}/>
                      </InputAdornment>
                    }
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: '30px',
                          marginTop: '8px',
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                          maxHeight: '200px',
                        },
                      },
                    }}
                  >
                    <StyledMenuItem value="student">Student</StyledMenuItem>
                    <StyledMenuItem value="teacher">Teacher</StyledMenuItem>
                    <StyledMenuItem value="institution_admin">Institution Admin</StyledMenuItem>
                    <StyledMenuItem value="super_admin">Super Admin</StyledMenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ height: '70px', position: 'relative', marginBottom: '10px', width: '100%' }}>
        <FormControl fullWidth margin="normal" sx={ellipseSelectStyle} error={formik.touched.institution_id && Boolean(formik.errors.institution_id)}>
          <InputLabel id="institution-label">Institution</InputLabel>
          <Select
            labelId="institution-label"
            id="institution_id"
            name="institution_id"
            label="Institution"
            required={formik.values.type !== 'super_admin'}
            value={formik.values.institution_id}
            onChange={formik.handleChange}
            disabled={loading || formik.values.type === 'super_admin'}
            IconComponent={ArrowDropDownIcon}
            sx={{
              '& .MuiSelect-select': {
                paddingLeft: '36px !important',
              },
            }}
            startAdornment={
              <InputAdornment position="start" sx={{ position: 'absolute', left: 8 }}>
                <BusinessIcon sx={{ color: '#C215AE' }} />
              </InputAdornment>
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '30px',
                  marginTop: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  maxHeight: '200px',
                },
              },
            }}
          >
            <Box sx={{ p: 2, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search institutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {loading ? (
              <StyledMenuItem disabled>Loading institutions...</StyledMenuItem>
            ) : error ? (
              <StyledMenuItem disabled>{error}</StyledMenuItem>
            ) : filteredInstitutions.length === 0 ? (
              <StyledMenuItem disabled>No institutions found</StyledMenuItem>
            ) : (
              filteredInstitutions.map((institution) => (
                <StyledMenuItem key={institution.id} value={institution.id}>
                  {institution.name}
                </StyledMenuItem>
              ))
            )}
          </Select>
          {formik.touched.institution_id && formik.errors.institution_id && (
            <FormHelperText error sx={{ position: 'absolute', bottom: '-20px' }}>
              {formik.errors.institution_id}
            </FormHelperText>
          )}
        </FormControl>
      </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                width: '100%',
                mt: 0
              }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      value="remember" 
                      color="primary"  
                      sx={{
                        color:'#C215AE', 
                        '&.Mui-checked': {
                          color: '#C215AE',
                        }
                      }} 
                    />
                  }
                  label="Remember me"
                />
                <Link href="#" variant="body2" sx={{ color:'#C215AE'}}>
                  Forgot password?
                </Link>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button
                  name="submit"
                  type="submit"
                  id="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: '50px',
                    width: '50%',
                    backgroundColor: '#C215AE',
                    '&:hover': {
                      backgroundColor: 'purple',
                    },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
            <Link 
              href="/register" 
              variant="body2" 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                color:'#C215AE'
              }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>     
        </Container>
      </Box>
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
    </ThemeProvider>
  );
}