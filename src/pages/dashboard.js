import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  CircularProgress, 
  Alert, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  Slider,
  Button,
  Dialog,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch } from 'react-redux';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  BookOpen,
  User,
  School,
  BookMarked,
  Bell,
} from 'lucide-react';
import { fetchDashboardData } from '../action/dashboard';
import { fetchUserProfile } from '../action/user';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendAttendanceAlert } from '../action/attendance';

// Styled Components remain the same...
const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#F8DEF5',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const ContentBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '50px',
  padding: theme.spacing(4),
  width: '100%',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
}));

const StatCard = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
}));

const AlertButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#C215AE',
  color: 'white',
  borderRadius: '25px',
  padding: '8px 24px',
  '&:hover': {
    backgroundColor: '#A11290',
  }
}));


const ProgressBar = ({ value }) => (
  <Box 
    sx={{ 
      width: '100%', 
      backgroundColor: '#F8DEF5', 
      borderRadius: '50px', 
      height: '10px', 
      overflow: 'hidden' 
    }}
  >
    <Box 
      sx={{ 
        width: `${value}%`, 
        height: '100%', 
        backgroundColor: '#C215AE',
        borderRadius: '50px',
        transition: 'width 0.5s ease-in-out'
      }} 
    />
  </Box>
);


export const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector(state => state.user.profile);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    // New state for alert dialog
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [threshold, setThreshold] = useState(70);
    const [sendingAlert, setSendingAlert] = useState(false);

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfileResponse = await dispatch(fetchUserProfile());
        
        if (userProfileResponse.success && userProfileResponse.data) {
          const userType = userProfileResponse.data.user_type;
          
          setLoading(true);
          const dashboardResponse = await dispatch(fetchDashboardData(userType));
          
          if (dashboardResponse.success) {
            if (userType === 'super_admin' || userType === 'institution_admin') {
              const filteredData = { ...dashboardResponse.data };
              if (filteredData[userType] && filteredData[userType].stats) {
                const { stats } = filteredData[userType];
                const filteredStats = Object.fromEntries(
                  Object.entries(stats).filter(([key]) => !key.toLowerCase().includes('attendance'))
                );
                filteredData[userType].stats = filteredStats;
              }
              setDashboardData(filteredData);
            } else {
              setDashboardData(dashboardResponse.data);
            }
            setError(null);
          } else {
            throw new Error(dashboardResponse.error || 'Failed to fetch dashboard data');
          }
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [dispatch]); 

  const handleOpenAlertDialog = () => {
    setAlertDialogOpen(true);
  };

  const handleCloseAlertDialog = () => {
    setAlertDialogOpen(false);
  };

  const handleSendAlert = async () => {
    try {
      setSendingAlert(true);
      const response = await dispatch(sendAttendanceAlert({
        user_type: user.user_type,
        threshold: threshold
      }));
      
      if (response.success) {
        setError(null);
        setSnackbarMessage('Alert sent successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        handleCloseAlertDialog();
      } else {
        throw new Error(response.error || 'Failed to send alert');
      }
    } catch (err) {
      setError('Failed to send alert: ' + err.message);
      setSnackbarMessage('Failed to send alert');
      setSnackbarSeverity('error');
      setOpenSnackbar(true); 
    } finally {
      setSendingAlert(false);
    }
  };

  const renderAlertDialog = () => (
    <Dialog open={alertDialogOpen} onClose={handleCloseAlertDialog}>
      <DialogTitle sx={{ color: '#C215AE' }}>Send Attendance Alert</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Set attendance threshold percentage:
        </Typography>
        <Slider
          value={threshold}
          onChange={(_, newValue) => setThreshold(newValue)}
          aria-labelledby="threshold-slider"
          valueLabelDisplay="auto"
          min={0}
          max={100}
          sx={{
            color: '#C215AE',
            '& .MuiSlider-thumb': {
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(194, 21, 174, 0.16)',
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAlertDialog}>Cancel</Button>
        <Button 
          onClick={handleSendAlert}
          disabled={sendingAlert}
          sx={{ color: '#C215AE' }}
        >
          {sendingAlert ? 'Sending...' : 'Send Alert'}
        </Button>
      </DialogActions>
    </Dialog>
  );


  const renderStats = (stats, icons) => (
    <Grid container spacing={3}>
      {Object.entries(stats).map(([key, value], index) => (
        <Grid item xs={12} sm={6} md={3} key={key}>
          <StatCard elevation={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C215AE' }}>
                {typeof value === 'number' && key.toLowerCase().includes('attendance') 
                  ? `${value}%` 
                  : value}
              </Typography>
            </Box>
            <Box 
              sx={{ 
                backgroundColor: '#F8DEF5', 
                borderRadius: '50%', 
                p: 1.5 
              }}
            >
              {icons[index] && React.createElement(icons[index], { 
                color: '#C215AE', 
                size: 24 
              })}
            </Box>
          </StatCard>
        </Grid>
      ))}
    </Grid>
  );

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress sx={{ color: '#C215AE' }} />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (!dashboardData || !dashboardData[user.user_type]) {
      return <Alert severity="info">No data available for this user type</Alert>;
    }
    
    const userData = dashboardData[user.user_type];


    const renderAlertButton = () => (
      <AlertButton
        startIcon={<Bell size={20} />}
        onClick={handleOpenAlertDialog}
        sx={{ mb: 3 }}
      >
        Send Attendance Alert
      </AlertButton>
    );

    const renderDetailSection = (title, items, keyName, valueKey = 'attendance') => (
      <ContentBox sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#C215AE', fontWeight: 'bold' }}>
          {title}
        </Typography>
        <TableContainer>
          <Table>
           
               <TableHead sx={{ backgroundColor: '#F8DEF5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>{keyName}</TableCell>
                {user.user_type != 'super_admin' && (
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Percentage</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.course_name || item.name} hover onClick={() => handleClassClick(item.class_id)} sx={{ cursor: 'pointer' }}>
                  <TableCell>
                    {item.course_name || item.name}
                    {item.students ? ` (${item.students} students)` : ''}
                    {item.grade ? ` (Grade: ${item.grade})` : ''}
                    {item.program_name ? ` (${item.program_name})` : ''}
                    {item.instructor_name ? ` - ${item.instructor_name}` : ''}
                  </TableCell>
                  {user.user_type != 'super_admin' && (
                    
                  
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mr: 2, 
                          color: '#C215AE', 
                          fontWeight: 'bold' 
                        }}
                      >
                        {item[valueKey]}%
                      </Typography>
                      <Box sx={{ width: '100px' }}>
                        <ProgressBar value={item[valueKey]} />
                      </Box>
                    </Box>
                  </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ContentBox>
    );

    switch (user.user_type) {
      case 'super_admin':
        return (
          <>
            {renderStats(userData.stats, [
              School,
              Users,
              User,
              BookMarked
            ])}
            {renderDetailSection('Institutions Overview', userData.institutions_list, 'Institution')}
          </>
        );

        case 'institution_admin':
        return (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {renderAlertButton()}
            </Box>
            {renderStats(userData.stats, [
              Users,
              User,
              BookMarked
            ])}
            {renderAlertDialog()}
          </>
        );

      case 'teacher':
        return (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {renderAlertButton()}
            </Box>
            {renderStats(userData.stats, [
              BookOpen,
              Users,
              Calendar
            ])}
            {renderDetailSection('Class Overview', userData.classes, 'Class', 'attendance')}
            {renderAlertDialog()}
          </>
        );

      case 'student':
        return (
          <>
            {renderStats(userData.stats, [
              BookOpen,
              Calendar,
              GraduationCap
            ])}
            {renderDetailSection('Courses', userData.classes, 'Course', 'class_attendance')}
          </>
        );

      default:
        return <Alert severity="warning">Invalid user type specified</Alert>;
    }
  };

  return (
    <StyledContainer>
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#C215AE', 
            mb: 3, 
            fontWeight: 'bold' 
          }}
        >
          Dashboard Overview
        </Typography>
        
        {renderDashboardContent()}
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '10px' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default Dashboard;