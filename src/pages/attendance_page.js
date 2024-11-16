import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import { fetchClasses, takeAttendance } from '../action/attendance';

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

const formControlStyle = {
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
    '&.Mui-focused': {
      color: '#C215AE',
    },
  },
  backgroundColor: 'white',
  borderRadius: '50px',
};

const AttendancePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.profile);

  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (user.role === 'teacher') {
          response = await dispatch(fetchClasses(null, user.id));
        } else {
          response = await dispatch(fetchClasses(location.state?.institutionId));
        }
        if (response.success) {
          setStudents(response.data);
          if (response.data.length > 0) {
            setSelectedClass(response.data[0].id);
          }
        } else {
          throw new Error(response.message || 'Failed to fetch classes');
        }
      } catch (error) {
        setSnackbarMessage(error.message || 'An error occurred. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };
    fetchData();
  }, [dispatch, location.state?.institutionId, user.id, user.role]);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    const selectedClassData = students.find((c) => c.id === event.target.value);
    setAttendance(
      selectedClassData.students.reduce((acc, student) => {
        acc[student.id] = 'present';
        return acc;
      }, {})
    );
  };

  const handleMarkAttendance = async () => {
    try {
      const response = await dispatch(takeAttendance(selectedClass, attendance));
/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Handle class selection change.
   * @param {Event} event - The input change event.
   * Set the selected class and initialize the attendance for all students in the class to 'present'.
   */
/******  f34fe8d3-7abe-4fee-a456-3f3399e2b770  *******/      if (response.success) {
        setSnackbarMessage('Attendance recorded successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } else {
        throw new Error(response.message || 'Failed to record attendance');
      }
    } catch (error) {
      setSnackbarMessage(error.message || 'An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: status,
    }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <StyledContainer>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mb: 3, alignSelf: 'flex-start' }}>
          Attendance
        </Typography>
        <ContentBox>
          {user.role === 'teacher' ? (
            <>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <FormControl variant="outlined" sx={{ ...formControlStyle, flexGrow: 1, mr: 2 }}>
                  <InputLabel id="class-select-label">Select Class</InputLabel>
                  <Select
                    labelId="class-select-label"
                    id="class-select"
                    value={selectedClass}
                    onChange={handleClassChange}
                    label="Select Class"
                  >
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <RoundedButton
                  variant="contained"
                  onClick={handleMarkAttendance}
                  sx={{ backgroundColor: '#C215AE', color: 'white', '&:hover': { backgroundColor: '#9E1188' } }}
                >
                  MARK ATTENDANCE
                </RoundedButton>
              </Box>

              <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} aria-label="attendance table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Attendance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.find((c) => c.id === selectedClass)?.students.map((student) => (
                      <TableRow
                        key={student.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <Select
                            value={attendance[student.id] || 'present'}
                            onChange={(event) => handleAttendanceChange(student.id, event.target.value)}
                            sx={{ ...formControlStyle, minWidth: '120px' }}
                          >
                            <MenuItem value="present">Present</MenuItem>
                            <MenuItem value="absent">Absent</MenuItem>
                            <MenuItem value="late">Late</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                View Your Attendance
              </Typography>
              <Typography variant="body1">
                Your attendance records will be displayed here.
              </Typography>
            </Box>
          )}
        </ContentBox>
      </Container>

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

export default AttendancePage;