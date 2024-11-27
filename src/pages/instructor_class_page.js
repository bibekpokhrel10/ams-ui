import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  TextField,
  Box,
  Container,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { fetchInstructorClasses, fetchClassStudents } from '../action/class';


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
    '&.Mui-focused': {
      color: '#C215AE',
    },
  },
  '& .MuiInputAdornment-root': {
    position: 'absolute',
    left: '14px',
  },
  backgroundColor: 'white',
  borderRadius: '50px',
};

const InstructorClassPage = () => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [studentSearchQuery, setStudentSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [openStudentsDialog, setOpenStudentsDialog] = useState(false);
    
    // Pagination states for classes
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    // Pagination states for students
    const [studentPage, setStudentPage] = useState(0);
    const [studentRowsPerPage, setStudentRowsPerPage] = useState(10);
    const [totalStudents, setTotalStudents] = useState(0);
  
    const instructorId = useSelector(state => state.auth.user?.id);
    const classes = useSelector(state => state.instructorClasses.list || []);
    const [students, setStudents] = useState([]);
  
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(fetchInstructorClasses(instructorId));
    }, [dispatch, instructorId]);
  
    // Modified to handle pagination and search
    useEffect(() => {
      if (selectedClass && openStudentsDialog) {
        const queryParams = {
                class_id: selectedClass.id,
                page: studentPage + 1,
                perPage: studentRowsPerPage,
                search: studentSearchQuery
        }
        dispatch(fetchClassStudents(queryParams))
          .then(response => {
            setStudents(response.data.data || []);
            setTotalStudents(response.data.total || 0);
          })
          .catch(error => {
            setSnackbarMessage('Failed to fetch students');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          });
      }
    }, [selectedClass, openStudentsDialog, dispatch, studentPage, studentRowsPerPage, studentSearchQuery]);
  
    // Debounce function for search
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    };
  
    const handleSearch = (value) => {
      setSearchQuery(value.toLowerCase());
      setPage(0);
    };
  
    const handleStudentSearch = debounce((value) => {
      setStudentSearchQuery(value);
      setStudentPage(0);
    }, 500);
  
    // Pagination handlers for classes
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    // Pagination handlers for students
    const handleStudentChangePage = (event, newPage) => {
      setStudentPage(newPage);
    };
  
    const handleStudentChangeRowsPerPage = (event) => {
      setStudentRowsPerPage(parseInt(event.target.value, 10));
      setStudentPage(0);
    };
  
    const filterItems = (items, searchTerm, fields) => {
      if (!searchTerm) return items;
      return items.filter(item => 
        fields.some(field => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return value?.toString().toLowerCase().includes(searchTerm);
        })
      );
    };
  
    const filteredClasses = filterItems(classes, searchQuery, [
      'course.name',
      'course.semester.name',
      'course.semester.program.name',
      'schedule'
    ]);
  
    // Paginate classes locally
    const paginatedClasses = filteredClasses.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    const handleTakeAttendance = () => {
      navigate('/attendance', { 
        state: { 
          classData: selectedClass 
        } 
      });
      handleMenuClose();
    };
  

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleMenuOpen = (event, classItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedClass(classItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setOpenDetailsDialog(true);
    handleMenuClose();
  };

  const handleViewStudents = () => {
    setOpenStudentsDialog(true);
    handleMenuClose();
  };

  const handleCloseDialogs = () => {
    setOpenDetailsDialog(false);
    setOpenStudentsDialog(false);
    setSelectedClass(null);
  };

return (
    <StyledContainer>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box sx={{ alignSelf: 'flex-start', width: '100%', mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#C215AE', mt: 2 }}>
            My Classes
          </Typography>
        </Box>
        <ContentBox>
        <Box sx={{ display: 'flex', mb: 2, width: '100%' }}>
            <TextField
              variant="outlined"
              placeholder="Search classes..."
              size="small"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              sx={{ ...textfieldStyle, flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#C215AE' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }} aria-label="classes table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Program</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Semester</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Schedule</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClasses.map((classItem) => (
                  <TableRow
                    key={classItem.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <TableCell>{classItem.course.semester.program.name}</TableCell>
                    <TableCell>{classItem.course.semester.name}</TableCell>
                    <TableCell>{classItem.course.name}</TableCell>
                    <TableCell>{classItem.schedule}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleMenuOpen(event, classItem)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredClasses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </ContentBox>
      </Container>

      {/* Class Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDialogs}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '20px',
            padding: '16px',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Class Details</Typography>
            <IconButton onClick={handleCloseDialogs}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedClass && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DetailItem>
                  <Typography className="label">Program</Typography>
                  <Typography className="value">{selectedClass.course.semester.program.name}</Typography>
                </DetailItem>
                <DetailItem>
                  <Typography className="label">Semester</Typography>
                  <Typography className="value">{selectedClass.course.semester.name}</Typography>
                </DetailItem>
                <DetailItem>
                  <Typography className="label">Course</Typography>
                  <Typography className="value">{selectedClass.course.name}</Typography>
                </DetailItem>
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem>
                  <Typography className="label">Schedule</Typography>
                  <Typography className="value">{selectedClass.schedule}</Typography>
                </DetailItem>
                <DetailItem>
                  <Typography className="label">Year</Typography>
                  <Typography className="value">{selectedClass.year}</Typography>
                </DetailItem>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Students List Dialog */}
      <Dialog
        open={openStudentsDialog}
        onClose={handleCloseDialogs}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '20px',
            padding: '16px',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Enrolled Students</Typography>
            <IconButton onClick={handleCloseDialogs}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search students..."
              size="small"
              onChange={(e) => handleStudentSearch(e.target.value)}
              sx={{ ...textfieldStyle, width: '100%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#C215AE' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8DEF5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.user.id}</TableCell>
                    <TableCell>{`${student.user.first_name} ${student.user.last_name}`}</TableCell>
                    <TableCell>{student.user.email}</TableCell>
                    <TableCell>{student.user.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={totalStudents}
            page={studentPage}
            onPageChange={handleStudentChangePage}
            rowsPerPage={studentRowsPerPage}
            onRowsPerPageChange={handleStudentChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </DialogContent>
      </Dialog>

      {/* Menu */}
<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
  <MenuItem onClick={handleViewDetails}>
    <VisibilityIcon sx={{ mr: 1 }} />
    View Details
  </MenuItem>
  <MenuItem onClick={handleViewStudents}>
    <GroupIcon sx={{ mr: 1 }} />
    View Students
  </MenuItem>
  <MenuItem onClick={handleTakeAttendance}>
    <AssignmentTurnedInIcon sx={{ mr: 1 }} />
    Take Attendance
  </MenuItem>
</Menu>

      {/* Snackbar */}
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

export default InstructorClassPage;