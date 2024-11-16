import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, IconButton, Paper, List, ListItem, ListItemText, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Styled components matching institution page style
const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#F8DEF5',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '24px',
  padding: '1.5rem',
  height: '100%',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
}));

const StatCard = styled(Card)(({ theme }) => ({
  padding: '1.5rem',
  borderRadius: '16px',
  backgroundColor: 'white',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#F8DEF5',
  borderRadius: '12px',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#C215AE',
  },
  backgroundColor: '#F8DEF5',
}));

export const Dashboard = () => {
  // Dummy data - replace with actual API calls
  const [stats, setStats] = useState({
    totalStudents: 1250,
    totalInstitutions: 8,
    averageAttendance: 85,
    activePrograms: 24
  });

  const [attendanceTrends] = useState([
    { month: 'January', attendance: 82 },
    { month: 'February', attendance: 87 },
    { month: 'March', attendance: 85 },
    { month: 'April', attendance: 89 },
    { month: 'May', attendance: 92 },
    { month: 'June', attendance: 88 }
  ]);

  const [institutionDistribution] = useState([
    { name: 'Engineering', percentage: 35 },
    { name: 'Medical', percentage: 25 },
    { name: 'Business', percentage: 20 },
    { name: 'Arts', percentage: 20 }
  ]);

  const [recentPrograms] = useState([
    { name: 'Computer Science', students: 120, trend: 'up' },
    { name: 'Medicine', students: 85, trend: 'up' },
    { name: 'Business Admin', students: 95, trend: 'down' },
    { name: 'Civil Engineering', students: 75, trend: 'up' },
  ]);

  useEffect(() => {
    // Replace with actual API calls
    // const fetchDashboardData = async () => {
    //   try {
    //     const response = await fetch('/api/dashboard/stats');
    //     const data = await response.json();
    //     setStats(data.stats);
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //   }
    // };
    // fetchDashboardData();
  }, []);

  return (
    <StyledContainer>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ color: '#C215AE', mb: 4 }}>
          Dashboard Overview
        </Typography>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Total Students
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {stats.totalStudents}
                </Typography>
              </Box>
              <IconWrapper>
                <PeopleIcon sx={{ color: '#C215AE', fontSize: 28 }} />
              </IconWrapper>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Institutions
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {stats.totalInstitutions}
                </Typography>
              </Box>
              <IconWrapper>
                <SchoolIcon sx={{ color: '#C215AE', fontSize: 28 }} />
              </IconWrapper>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Avg. Attendance
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {stats.averageAttendance}%
                </Typography>
              </Box>
              <IconWrapper>
                <CalendarTodayIcon sx={{ color: '#C215AE', fontSize: 28 }} />
              </IconWrapper>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Active Programs
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {stats.activePrograms}
                </Typography>
              </Box>
              <IconWrapper>
                <MenuBookIcon sx={{ color: '#C215AE', fontSize: 28 }} />
              </IconWrapper>
            </StatCard>
          </Grid>

          {/* Attendance Trends */}
          <Grid item xs={12} md={8}>
            <ContentBox>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Monthly Attendance Trends
              </Typography>
              <Grid container spacing={2}>
                {attendanceTrends.map((month, index) => (
                  <Grid item xs={12} key={month.month}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{month.month}</Typography>
                        <Typography variant="body2" sx={{ color: '#C215AE' }}>
                          {month.attendance}%
                        </Typography>
                      </Box>
                      <ProgressBar variant="determinate" value={month.attendance} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </ContentBox>
          </Grid>

          {/* Institution Distribution */}
          <Grid item xs={12} md={4}>
            <ContentBox>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Institution Distribution
              </Typography>
              {institutionDistribution.map((inst) => (
                <Box key={inst.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{inst.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#C215AE' }}>
                      {inst.percentage}%
                    </Typography>
                  </Box>
                  <ProgressBar variant="determinate" value={inst.percentage} />
                </Box>
              ))}
            </ContentBox>
          </Grid>

          {/* Recent Programs */}
          <Grid item xs={12}>
            <ContentBox>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Recent Programs Overview
              </Typography>
              <Grid container spacing={2}>
                {recentPrograms.map((program) => (
                  <Grid item xs={12} sm={6} md={3} key={program.name}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        border: '1px solid #F8DEF5',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {program.name}
                        </Typography>
                        {program.trend === 'up' ? 
                          <TrendingUpIcon sx={{ color: '#4CAF50' }} /> : 
                          <TrendingDownIcon sx={{ color: '#f44336' }} />
                        }
                      </Box>
                      <Typography variant="h6" sx={{ color: '#C215AE' }}>
                        {program.students} students
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </ContentBox>
          </Grid>
        </Grid>
      </Container>
    </StyledContainer>
  );
};