import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SchoolIcon from '@mui/icons-material/School';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../action/auth';
import { fetchUserProfile } from '../../action/user';

const drawerWidth = 120;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(to right, #A6539C, #7E3F76)',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  minHeight: 80,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
  color: 'white',
  backgroundColor: selected ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  padding: theme.spacing(1),
}));

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: 0,
  justifyContent: 'center',
  color: 'white',
  fontSize: '2rem',
  marginBottom: '4px',
});

const StyledListItemText = styled(ListItemText)({
  '& .MuiListItemText-primary': {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export function PrimarySearchAppBar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openProfileDialog, setOpenProfileDialog] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const user = useSelector(state => state.user.profile);

  const isMenuOpen = Boolean(anchorEl);

  const menuId = 'primary-search-account-menu';

  React.useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchUserProfile()),
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfileClick = () => {
    setOpenProfileDialog(true);
    handleMenuClose();
  };

  // Add handleListItemClick function
  const handleListItemClick = (item) => {
    navigate(item.path);
  };

  // Add renderMenu component
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );


  const getMenuItems = () => {
    if (!user || !user.user_type) {
      return [{ text: 'Dashboard', icon: <DashboardIcon fontSize="large" />, path: '/dashboard' }];
    }

    const menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon fontSize="large" />, path: '/dashboard' },
    ];

    switch (user.user_type) {
      case 'super_admin':
        menuItems.push(
          { 
            text: 'Institutions', 
            icon: <BusinessIcon fontSize="large" />, 
            path: '/institutions' 
          },
          { 
            text: 'Users', 
            icon: <PeopleIcon fontSize="large" />, 
            path: '/users' 
          }
        );
        break;

      case 'institution_admin':
        menuItems.push(
          { 
            text: 'Programs', 
            icon: <SchoolIcon fontSize="large" />, 
            path: `/institutions/${user.institution_id}/programs` 
          },
          { 
            text: 'Users', 
            icon: <PeopleIcon fontSize="large" />, 
            path: `/institutions/${user.institution_id}/users` 
          }
        );
        break;

      case 'teacher':
        menuItems.push(
          { 
            text: 'Class', 
            icon: <SchoolIcon fontSize="large" />, 
            path: `/instructor/classes` 
          },
        );
        break;

      default:
        break;
    }

    return menuItems;
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return(
  <Box sx={{ display: 'flex' }}>
  <StyledAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
    <Typography 
  variant="h6" 
  noWrap 
  component="div" 
  sx={{ 
    flexGrow: 1, 
    display: 'flex', 
    alignItems: 'center' 
  }}
>
  <img 
    src="/ams.png" 
    alt="AMS Logo" 
    style={{ 
      height: '40px', 
      marginRight: '10px' 
    }} 
  />
</Typography>
      <Typography variant="subtitle1" sx={{ mr: 2 }}>
        {user?.first_name} {user?.last_name} {user?.user_type && `(${user.user_type.replace('_', ' ')})`}
      </Typography>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    </Toolbar>
  </StyledAppBar>
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { 
        width: drawerWidth, 
        boxSizing: 'border-box',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #A6539C, #7E3F76)',
        paddingTop: '10px',
      },
    }}
  >
    <Toolbar />
    <Box sx={{ overflow: 'auto', width: '100%' }}>
      <List>
        {getMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              onClick={() => handleListItemClick(item)}
              selected={location.pathname === item.path}
            >
              <StyledListItemIcon>
                {item.icon}
              </StyledListItemIcon>
              <StyledListItemText primary={item.text} />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
  <Box component="main" sx={{ flexGrow: 1, p: 1, width: `calc(100% - ${drawerWidth}px)` }}>
    <Toolbar />
    {props.children}
  </Box>
  {renderMenu}
  {user && <ProfileDialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} user={user} />}
</Box>
);
}

const ProfileDialog = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>User Profile</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Name: {user?.first_name} {user?.last_name}</Typography>
        <Typography variant="body1">Email: {user?.email}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
