import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
  Chip,
  Avatar,
  Alert,
  Snackbar,
  Button,
  TablePagination,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Info,
  Close,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { format, isToday, set } from 'date-fns';
import {
  fetchAttendanceByDate,
  takeAttendance,
  fetchAttendanceStats,
} from '../action/attendance';
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

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  width: '100%',
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

  // New state variables for pagination and search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalStudents, setTotalStudents] = useState(0);
  const [stats, setStats] = useState({
    total_students: 0,
    total_present: 0,
    total_absent: 0,
    total_on_leave: 0,
    total_late: 0,
  });

  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'leave', label: 'On Leave' },
  ];
  
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setPage(0); // Reset pagination when date changes
  };
  
  const handlePreviousDay = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };
  
  const handleNextDay = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (selectedDate < tomorrow) {
      setSelectedDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
      });
    }
  };
  
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };
  
  useEffect(() => {
    if (classData?.id) {
      const fetchData = async () => {
        try {
          // Fetch students data
          const studentsResponse = await dispatch(fetchClassStudents({
            class_id: classData.id,
            page: page + 1,
            per_page: rowsPerPage,
            search: searchQuery,
          }));
          
          const studentsData = studentsResponse.data?.data || [];
          const meta = studentsResponse.data?.count || { total: 0 };
          setStudents(studentsData);
          setTotalStudents(meta);

          // Fetch attendance data
          const attendanceResponse = await dispatch(fetchAttendanceByDate({
            class_id: classData.id,
            date: new Date(selectedDate.toISOString().split('T')[0]).toISOString(),
          }));

          // Process attendance data
          const attendanceData = attendanceResponse.data?.data || [];
          
          // Create a map of student_id to attendance data
          const attendanceMap = {};
          attendanceData.forEach(record => {
            attendanceMap[record.student_id] = {
              is_present: record.is_present,
              status: record.status,
            };
          });

          // Create default attendance for students without records
          const finalAttendanceMap = studentsData.reduce((acc, student) => {
            acc[student.user.id] = attendanceMap[student.user.id] || {
              is_present: false,
              status: 'absent',
            };
            return acc;
          }, {});

          setAttendance(finalAttendanceMap);

          // Fetch stats
          const statsResponse = await dispatch(fetchAttendanceStats({
            class_id: classData.id,
            date: new Date(selectedDate.toISOString().split('T')[0]).toISOString(),
          }));
          
          if (statsResponse.data?.data) {
            setStats(statsResponse.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch attendance data:', error);
          setSnackbarMessage('Failed to fetch attendance data');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      };

      fetchData();
    }
  }, [classData, selectedDate, page, rowsPerPage, searchQuery]);
  
  const fetchStats = async () => {
    try {
      const response = await dispatch(fetchAttendanceStats({
        class_id: classData.id,
        date: new Date(selectedDate.toISOString().split('T')[0]).toISOString(),
      }));
      if (!response.success) {
        setStats({
          total_students: 0,
          total_present: 0,
          total_absent: 0,
          total_late: 0,
        });
      } else {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch attendance stats:', error);
    }
  }; 
  
  const handleStatusChange = (studentId, newStatus) => {
    if (!isEditable) return;
  
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        status: newStatus,
        is_present: newStatus === 'present' || newStatus === 'late',
      },
    }));
  };
  
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value,  
   10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };
  
  const  
   handleSubmitAttendance = async () => {
    if (!isEditable) return;
  
    try {
      const attendanceData = {
        class_id: classData.id,
        date: new Date(selectedDate.toISOString().split('T')[0]).toISOString(),
        attendance: Object.entries(attendance).map(([studentId, data]) => ({
          student_id: Number(studentId),
          is_present: data.is_present,
          status: data.status,
        })),
      };
  
      const response = await dispatch(takeAttendance(attendanceData));
      if (response.success) {
        setSnackbarMessage('Attendance recorded successfully!');
        setSnackbarSeverity('success');
        fetchStats();
      } else {
        throw new Error(response.message || 'Failed to record attendance');
      }
    } catch (error) {
      setSnackbarMessage(error.message || 'An error occurred');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
  };
  
  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderAttendanceStatus = (student) => {
    const studentAttendance = attendance[student.user.id];
    return (
      <TableCell>
        <FormControl disabled={!isEditable} fullWidth>
          <Select
            value={studentAttendance?.status || 'absent'}
            onChange={(e) => handleStatusChange(student.user.id, e.target.value)}
            size="small"
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
    );
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
        <Grid item xs={12} sm={2.4}>
          <StatsCard elevation={2}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h4" sx={{ color: '#C215AE' }}>{stats.total_students}</Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <StatsCard elevation={2}>
            <Typography variant="h6">Present</Typography>
            <Typography variant="h4" sx={{ color: '#4CAF50' }}>{stats.total_present}</Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <StatsCard elevation={2}>
            <Typography variant="h6">Absent</Typography>
            <Typography variant="h4" sx={{ color: '#F44336' }}>{stats.total_absent}</Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <StatsCard elevation={2}>
            <Typography variant="h6">On Leave</Typography>
            <Typography variant="h4" sx={{ color: '#2196F3' }}>{stats.total_on_leave}</Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={2.4}>
          <StatsCard elevation={2}>
            <Typography variant="h6">Late</Typography>
            <Typography variant="h4" sx={{ color: 'yellow' }}>{stats.total_late}</Typography>
          </StatsCard>
        </Grid>
      </Grid>

      <ContentBox>
        <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Table>
          <TableHead>
              <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Attendance Status</TableCell>
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
          {/* <TableCell>
            <Chip
              label={student.user.status}
              color={student.status === 'active' ? 'success' : 'default'}
              size="small"
            />
          </TableCell> */}
          {renderAttendanceStatus(student)}
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

          <TablePagination
            component="div"
            count={totalStudents}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />

{isEditable && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSubmitAttendance}
              sx={{
                bgcolor: '#C215AE',
                '&:hover': { bgcolor: '#9E1188' },
                borderRadius: '25px',
                px: 4,
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
                  <Typography className="label">Attendance ({format(selectedDate, 'MMM d, yyyy')})</Typography>
                  <Chip
                    label={attendance[selectedStudent.id] || 'present'}
                    color={getAttendanceStatusColor(attendance[selectedStudent.id])}
                    size="small"
                  />
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