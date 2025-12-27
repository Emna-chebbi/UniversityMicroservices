import React, { useState } from 'react';
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List,
  ListItem, ListItemIcon, ListItemText, Toolbar, Typography,
  useTheme, useMediaQuery, Avatar, Divider, Badge, Button
} from '@mui/material';
import {
  Menu, Dashboard, School, MenuBook, Home,
  Notifications, AccountCircle, Logout,
  Settings, TrendingUp, CalendarToday
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Universities', icon: <School />, path: '/universities' },
    { text: 'Courses', icon: <MenuBook />, path: '/courses' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogoClick = () => {
    window.location.href = 'http://localhost:3000/';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Button
        onClick={handleLogoClick}
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          textTransform: 'none',
          width: '100%',
          borderRadius: 0,
          justifyContent: 'flex-start',
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
          }
        }}
      >
        <Avatar
          sx={{
            mr: 2,
            bgcolor: 'white',
            color: theme.palette.primary.main,
            width: 40,
            height: 40
          }}
        >
          <School />
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h6" fontWeight="bold">
            UniManage
          </Typography>
          <Typography variant="caption">
            University System
          </Typography>
        </Box>
      </Button>

      <Divider />

      {/* Quick Stats */}
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Quick Stats
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TrendingUp sx={{ fontSize: 16, color: '#4caf50', mr: 1 }} />
          <Typography variant="caption" color="text.secondary">
            System is running optimally
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ fontSize: 16, color: '#ff9800', mr: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Last updated: Today
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flex: 1, p: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              cursor: 'pointer',
              bgcolor: location.pathname === item.path ? 
                'rgba(63, 81, 181, 0.08)' : 'transparent',
              color: location.pathname === item.path ? 
                theme.palette.primary.main : 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(63, 81, 181, 0.04)',
                color: theme.palette.primary.main,
              },
              transition: 'all 0.2s'
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 
                theme.palette.primary.main : 'text.secondary',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 24px rgba(0,0,0,0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 24px rgba(0,0,0,0.08)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
          bgcolor: theme.palette.background.default
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;