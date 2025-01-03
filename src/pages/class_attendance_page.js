import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import { styled } from '@mui/system';
import { Calendar, BookOpen, Clock, TrendingUp, User } from 'lucide-react';
import { fetchClassAttendanceData } from '../action/attendance';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// Styled components remain the same
const StyledContainer = styled(Box)(() => ({
  backgroundColor: '#F8DEF5',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px',
}));

const ContentBox = styled(Paper)(() => ({
  backgroundColor: 'white',
  borderRadius: '50px',
  padding: '32px',
  width: '100%',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
}));

const StatCard = styled(Paper)(() => ({
  borderRadius: '20px',
  padding: '24px',
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

const ClassAttendanceDetail = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [selectedView, setSelectedView] = useState('weekly');
  const user = useSelector(state => state.user.profile);

  useEffect(() => {
    const fetchClassData = async () => {
      if (!id) {
        setError("No class ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userType = user?.user_type?.toLowerCase();
        if (!userType) {
          throw new Error("User type not available");
        }

        const response = await dispatch(fetchClassAttendanceData(id, userType));
        if (response?.data) {
          setClassData(response.data.data);
        } else {
          throw new Error('No data received from server');
        }
      } catch (err) {
        console.error('Error fetching class data:', err);
        setError(err.message || "Failed to fetch class data");
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id, user?.user_type, dispatch]);

  const renderStudentView = () => (
    <>
      <ContentBox sx={{ mb: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#C215AE', mb: 1 }}>
            Student Information
          </Typography>
          <Typography variant="body1">
            Name: {classData.basic_info.student_name}
          </Typography>
          <Typography variant="body1">
            Roll Number: {classData.basic_info.roll_number}
          </Typography>
          <Typography variant="body1">
            Course: {classData.basic_info.course_name} ({classData.basic_info.course_code})
          </Typography>
          <Typography variant="body1">
            Schedule: {classData.basic_info.schedule}
          </Typography>
          <Typography variant="body1">
            Instructor: {classData.basic_info.instructor_name}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
          <StatCard elevation={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Overall Attendance
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C215AE' }}>
                {((classData.basic_info.present_classes / classData.basic_info.total_classes) * 100).toFixed(1)}%
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#F8DEF5', borderRadius: '50%', p: 1.5 }}>
              <BookOpen color="#C215AE" size={24} />
            </Box>
          </StatCard>

          <StatCard elevation={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Classes Attended
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C215AE' }}>
                {classData.basic_info.present_classes}/{classData.basic_info.total_classes}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#F8DEF5', borderRadius: '50%', p: 1.5 }}>
              <Clock color="#C215AE" size={24} />
            </Box>
          </StatCard>

          <StatCard elevation={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Current Streak
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C215AE' }}>
                {classData.basic_info.current_streak} days
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#F8DEF5', borderRadius: '50%', p: 1.5 }}>
              <TrendingUp color="#C215AE" size={24} />
            </Box>
          </StatCard>

          <StatCard elevation={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Status
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C215AE' }}>
                {((classData.basic_info.present_classes / classData.basic_info.total_classes) * 100) >= 75 ? 'Good Standing' : 'Warning'}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#F8DEF5', borderRadius: '50%', p: 1.5 }}>
              <Calendar color="#C215AE" size={24} />
            </Box>
          </StatCard>
        </Box>
      </ContentBox>

      <ContentBox sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#C215AE', fontWeight: 'bold' }}>
          Monthly Progress
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8DEF5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Month</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Classes Attended</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Attendance</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classData.monthly_attendance.map((month) => (
                <TableRow key={month.month}>
                  <TableCell>{month.month}</TableCell>
                  <TableCell>{month.present}/{month.total}</TableCell>
                  <TableCell>{month.attendance.toFixed(1)}%</TableCell>
                  <TableCell sx={{ width: '40%' }}>
                    <ProgressBar value={month.attendance} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ContentBox>

      <ContentBox>
        <Typography variant="h6" sx={{ mb: 2, color: '#C215AE', fontWeight: 'bold' }}>
          Recent Classes
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8DEF5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Week</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classData.recent_attendance.map((day, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                  <TableCell>{day.week}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        px: 2, 
                        py: 0.5, 
                        borderRadius: '50px',
                        display: 'inline-block',
                        bgcolor: day.status === 'Present' ? '#E8F5E9' : '#FFEBEE',
                        color: day.status === 'Present' ? '#2E7D32' : '#C62828'
                      }}
                    >
                      {day.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ContentBox>
    </>
  );

  const renderTeacherView = () => (
    <>
      <ContentBox sx={{ mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
          <StatCard elevation={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Overall Attendance
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C215AE' }}>
                {classData.basic_info.overall_attendance.toFixed(1)}%
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#F8DEF5', borderRadius: '50%', p: 1.5 }}>
              <BookOpen color="#C215AE" size={24} />
            </Box>
          </StatCard>

          <StatCard elevation={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C215AE' }}>
                {classData.basic_info.total_students}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#F8DEF5', borderRadius: '50%', p: 1.5 }}>
              <User color="#C215AE" size={24} />
            </Box>
          </StatCard>

          <StatCard elevation={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Classes
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C215AE' }}>
                {classData.basic_info.total_classes}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#F8DEF5', borderRadius: '50%', p: 1.5 }}>
              <Clock color="#C215AE" size={24} />
            </Box>
          </StatCard>

          <StatCard elevation={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Course Code
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C215AE' }}>
                {classData.basic_info.course_code}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#F8DEF5', borderRadius: '50%', p: 1.5 }}>
              <Calendar color="#C215AE" size={24} />
            </Box>
          </StatCard>
        </Box>
      </ContentBox>

      <ContentBox sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#C215AE', fontWeight: 'bold' }}>
          Attendance Trends
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant={selectedView === 'weekly' ? 'contained' : 'outlined'}
            onClick={() => setSelectedView('weekly')}
            sx={{ 
              bgcolor: selectedView === 'weekly' ? '#C215AE' : 'transparent',
              '&:hover': { bgcolor: selectedView === 'weekly' ? '#A01290' : 'rgba(194, 21, 174, 0.1)' }
            }}
          >
            Weekly View
          </Button>
          <Button
            variant={selectedView === 'monthly' ? 'contained' : 'outlined'}
            onClick={() => setSelectedView('monthly')}
            sx={{ 
              bgcolor: selectedView === 'monthly' ? '#C215AE' : 'transparent',
              '&:hover': { bgcolor: selectedView === 'monthly' ? '#A01290' : 'rgba(194, 21, 174, 0.1)' }
            }}
          >
            Monthly View
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8DEF5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Period</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Attendance</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Present/Total</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(selectedView === 'weekly' ? classData.weekly_data : classData.monthly_data).map((period) => (
                <TableRow key={period.week || period.month}>
                  <TableCell>{period.week || period.month}</TableCell>
                  <TableCell>{period.attendance.toFixed(1)}%</TableCell>
                  <TableCell>{period.present}/{period.total}</TableCell>
                  <TableCell sx={{ width: '40%' }}>
                  <ProgressBar value={period.attendance} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ContentBox>

      <ContentBox>
        <Typography variant="h6" sx={{ mb: 2, color: '#C215AE', fontWeight: 'bold' }}>
          Student Attendance Details
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8DEF5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Attendance</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classData.student_list.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography color="#C215AE" fontWeight="bold">
                        {student.attendance.toFixed(1)}%
                      </Typography>
                      <Box sx={{ width: '100px' }}>
                        <ProgressBar value={student.attendance} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        px: 2, 
                        py: 0.5, 
                        borderRadius: '50px',
                        display: 'inline-block',
                        bgcolor: student.attendance >= 90 
                          ? '#E8F5E9'
                          : student.attendance >= 75
                          ? '#FFF3E0'
                          : '#FFEBEE',
                        color: student.attendance >= 90
                          ? '#2E7D32'
                          : student.attendance >= 75
                          ? '#E65100'
                          : '#C62828'
                      }}
                    >
                      {student.attendance >= 90 
                        ? 'Excellent' 
                        : student.attendance >= 75 
                        ? 'Good' 
                        : 'Needs Improvement'}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ContentBox>
    </>
  );

  if (loading) {
    return (
      <StyledContainer>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </Box>
        </Container>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Container maxWidth="lg">
          <Box p={4} bgcolor="error.light" color="error.main" borderRadius={2}>
            {error}
          </Box>
        </Container>
      </StyledContainer>
    );
  }

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
          {classData?.basic_info?.course_name || 'Class Attendance'} - {user?.user_type === 'student' ? 'My Attendance' : 'Attendance Details'}
        </Typography>

        {user?.user_type === 'student' ? renderStudentView() : renderTeacherView()}
      </Container>
    </StyledContainer>
  );
};

export default ClassAttendanceDetail;