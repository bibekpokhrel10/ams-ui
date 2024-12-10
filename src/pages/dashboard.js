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
  TableBody,
  IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch } from 'react-redux';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  GraduationCap,
  User,
  BookOpen as ClassIcon
} from 'lucide-react';
import { fetchDashboardData } from '../action/dashboard';
import { fetchUserProfile } from '../action/user';
import { useSelector } from 'react-redux';

// Styled Components
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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.user.profile);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, fetch user profile
        const userProfileResponse = await dispatch(fetchUserProfile());
        
        // Check if user profile is successfully fetched
        if (userProfileResponse.success && userProfileResponse.data) {
          const userType = userProfileResponse.data.user_type;
          
          // Now fetch dashboard data with the user type
          setLoading(true);
          const dashboardResponse = await dispatch(fetchDashboardData(userType));
          
          if (dashboardResponse.success) {
            setDashboardData(dashboardResponse.data);
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
              {React.createElement(icons[index], { 
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
    console.log("dashboardData :: ", dashboardData);
    console.log("user type :: ", user);
    if (!dashboardData || !dashboardData[user.user_type]) {
      return <Alert severity="info">No data available for this user type</Alert>;
    }
    
    const userData = dashboardData[user.user_type];

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
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.course_name || item.name} hover>
                  <TableCell>
                    {item.course_name || item.name}
                    {item.students ? ` (${item.students} students)` : ''}
                    {item.grade ? ` (Grade: ${item.grade})` : ''}
                    {item.program_name ? ` (${item.program_name})` : ''}
                    {item.instructor_name ? ` - ${item.instructor_name}` : ''}
                  </TableCell>
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
              GraduationCap,
              Users,
              User,
              BookOpen
            ])}
            {renderDetailSection('Institutions Overview', userData.institutions_list, 'Institution')}
          </>
        );

      case 'institution_admin':
        return (
          <>
            {renderStats(userData.stats, [
              Users,
              User,
              BookOpen,
              Calendar
            ])}
            {renderDetailSection('Monthly Attendance Trends', userData.attendance_trends, 'Month')}
          </>
        );

      case 'teacher':
        return (
          <>
            {renderStats(userData.stats, [
             ClassIcon,
             Users,
             Calendar
            ])}
            {renderDetailSection('Class Overview', userData.classes, 'Class', 'attendance')}
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
            {renderDetailSection('Monthly Attendance', userData.monthly_attendance, 'Month', 'attendance')}
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
    </StyledContainer>
  );
};

export default Dashboard;