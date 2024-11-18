import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Typography,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Checkbox,
  Chip,
  Avatar,
  Alert,
  Snackbar,
  Button,
  TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import { 
  Person, 
  Info, 
  CheckCircle, 
  Cancel, 
  Close,
  ChevronLeft,
  ChevronRight 
} from '@mui/icons-material';
import { format, isToday } from 'date-fns';
import {  fetchAttendanceByDate, takeAttendance } from '../action/attendance';
import { fetchClassStudents } from '../action/class';
import CustomDatePicker from '../components/datepicker/datepicker';

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
  maxWidth: '1100px',
  minHeight: '300px',
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '150px',
}));

const DetailItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .label': {
    fontWeight: 'bold',
    color: '#666',
    marginBottom: theme.spacing(0.5),
  },
  '& .value': {
    color: '#333',
  },
}));

const DateNavigationBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: 'white',
  borderRadius: '25px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const AttendancePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const classData = location.state?.classData;
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditable, setIsEditable] = useState(true);
  
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0
  });

  useEffect(() => {
    if (classData?.id) {
      loadAttendanceData();
    }
  }, [selectedDate, classData]);

  const loadAttendanceData = async () => {
    try {
      // Fetch students
      const studentsResponse = await dispatch(fetchClassStudents({ class_id: classData.id }));
      const studentData = studentsResponse.data.data || [];
      setStudents(studentData);

      // Fetch attendance for selected date
      const attendanceResponse = await dispatch(fetchAttendanceByDate({
        class_id: classData.id,
        date: format(selectedDate, 'yyyy-MM-dd')
      }));

      const attendanceData = attendanceResponse.data || {};
      
      // Transform attendance data
      const attendanceMap = studentData.reduce((acc, student) => {
        const studentAttendance = attendanceData[student.id];
        acc[student.id] = studentAttendance ? studentAttendance.status === 'present' : true;
        return acc;
      }, {});

      setAttendance(attendanceMap);
      updateStats(attendanceMap);
      
      // Set editability based on date
      setIsEditable(isToday(selectedDate));

    } catch (error) {
      setSnackbarMessage('Failed to fetch attendance data');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const updateStats = (currentAttendance) => {
    const presentCount = Object.values(currentAttendance).filter(status => status).length;
    setStats({
      total: students.length,
      present: presentCount,
      absent: students.length - presentCount
    });
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handlePreviousDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (selectedDate < tomorrow) {
      setSelectedDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
      });
    }
  };

  const handleAttendanceChange = (studentId) => {
    if (!isEditable) return;
    
    const newAttendance = {
      ...attendance,
      [studentId]: !attendance[studentId]
    };
    setAttendance(newAttendance);
    updateStats(newAttendance);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const handleSubmitAttendance = async () => {
    if (!isEditable) return;

    try {
      const attendanceData = {
        class_id: classData.id,
        date:new Date(selectedDate.toISOString().split('T')[0]).toISOString(),
        attendance: Object.entries(attendance).map(([studentId, isPresent]) => ({
          student_id: Number(studentId),
          status: isPresent ? 'present' : 'absent'
        }))
      };

      const response = await dispatch(takeAttendance(attendanceData));
      if (response.success) {
        setSnackbarMessage('Attendance recorded successfully!');
        setSnackbarSeverity('success');
      } else {
        throw new Error(response.message || 'Failed to record attendance');
      }
    } catch (error) {
      setSnackbarMessage(error.message || 'An error occurred');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
  };

  return (
    <StyledContainer>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mb: 3, alignSelf: 'flex-start' }}>
          Attendance - {classData?.course?.name}
        </Typography>

        <DateNavigationBox>
  <IconButton onClick={handlePreviousDay}>
    <ChevronLeft />
  </IconButton>
  <CustomDatePicker
    selectedDate={selectedDate}
    onChange={handleDateChange}
    maxDate={new Date()}
  />

  <IconButton 
    onClick={handleNextDay}
    disabled={isToday(selectedDate)}
  >
    <ChevronRight />
  </IconButton>
</DateNavigationBox>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <StatsCard elevation={2}>
              <Typography variant="h6">Total Students</Typography>
              <Typography variant="h4" sx={{ color: '#C215AE' }}>{stats.total}</Typography>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard elevation={2}>
              <Typography variant="h6">Present</Typography>
              <Typography variant="h4" sx={{ color: '#4CAF50' }}>{stats.present}</Typography>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard elevation={2}>
              <Typography variant="h6">Absent</Typography>
              <Typography variant="h4" sx={{ color: '#F44336' }}>{stats.absent}</Typography>
            </StatsCard>
          </Grid>
        </Grid>

        <ContentBox>
          {!isEditable && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Viewing historical attendance data for {format(selectedDate, 'MMMM d, yyyy')}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Attendance</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.user.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: '#C215AE' }}>
                          {student.user.first_name[0]}
                        </Avatar>
                        {`${student.user.first_name} ${student.user.last_name}`}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.user.status}
                        color={student.user.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={attendance[student.id] || false}
                        onChange={() => handleAttendanceChange(student.id)}
                        icon={<Cancel color="error" />}
                        checkedIcon={<CheckCircle color="success" />}
                        disabled={!isEditable}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleStudentClick(student)}>
                        <Info />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {isEditable && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleSubmitAttendance}
                sx={{
                  bgcolor: '#C215AE',
                  '&:hover': { bgcolor: '#9E1188' },
                  borderRadius: '25px',
                  px: 4
                }}
              >
                Submit Attendance
              </Button>
            </Box>
          )}
        </ContentBox>
      </Container>

      {/* Student Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: { borderRadius: '20px', padding: '16px' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Student Details</Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar
                  sx={{ width: 100, height: 100, bgcolor: '#C215AE', fontSize: '2.5rem' }}
                >
                  {selectedStudent.user.first_name[0]}
                </Avatar>
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem>
                  <Typography className="label">Student ID</Typography>
                  <Typography className="value">{selectedStudent.user.id}</Typography>
                </DetailItem>
                <DetailItem>
                  <Typography className="label">Full Name</Typography>
                  <Typography className="value">
                    {`${selectedStudent.user.first_name} ${selectedStudent.user.last_name}`}
                  </Typography>
                </DetailItem>
                <DetailItem>
                  <Typography className="label">Email</Typography>
                  <Typography className="value">{selectedStudent.user.email}</Typography>
                </DetailItem>
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem>
                  <Typography className="label">Status</Typography>
                  <Typography className="value">{selectedStudent.user.status}</Typography>
                </DetailItem>
                <DetailItem>
                  <Typography className="label">Attendance ({format(selectedDate, 'MMM d, yyyy')})</Typography>
                  <Typography className="value">
                    {attendance[selectedStudent.id] ? 'Present' : 'Absent'}
                  </Typography>
                </DetailItem>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

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

export default AttendancePage;