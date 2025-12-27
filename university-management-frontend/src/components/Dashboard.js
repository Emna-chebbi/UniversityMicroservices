import React, { useState, useEffect } from 'react';
import { universityAPI, courseAPI } from '../services/api';
import {
  Box, Grid, Card, CardContent, Typography, Container,
  LinearProgress, Avatar, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Paper, useTheme, alpha, Divider, IconButton
} from '@mui/material';
import {
  School, MenuBook, People, AttachMoney,
  TrendingUp, TrendingDown, CheckCircle,
  Error, Warning, Info, ArrowForward,
  Add, MoreVert, CalendarToday, LocationOn,
  Group, LibraryBooks, VerifiedUser
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalUniversities: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalRevenue: 0,
    studentsEnrolled: 0,
    departments: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch universities
      const universitiesRes = await universityAPI.getAllUniversities();
      const universitiesData = universitiesRes.data;
      
      // Fetch all courses
      const coursesRes = await courseAPI.getAllCourses();
      const coursesData = coursesRes.data;
      
      // Fetch active courses
      const activeCoursesRes = await courseAPI.getActiveCourses();
      const activeCoursesData = activeCoursesRes.data;
      
      // Calculate total revenue
      const totalRevenue = coursesData.reduce((sum, course) => 
        sum + (parseFloat(course.tuitionFee) || 0), 0
      );
      
      // Calculate unique departments
      const uniqueDepartments = [...new Set(coursesData.map(course => course.department))];
      
      // Prepare chart data
      const monthlyData = [
        { month: 'Jan', courses: 45, revenue: 45000 },
        { month: 'Feb', courses: 52, revenue: 52000 },
        { month: 'Mar', courses: 48, revenue: 48000 },
        { month: 'Apr', courses: 61, revenue: 61000 },
        { month: 'May', courses: 55, revenue: 55000 },
        { month: 'Jun', courses: 58, revenue: 58000 },
      ];
      
      // Prepare department distribution
      const departmentDistribution = uniqueDepartments.map(dept => ({
        name: dept,
        value: coursesData.filter(course => course.department === dept).length
      }));
      
      setStats({
        totalUniversities: universitiesData.length,
        totalCourses: coursesData.length,
        activeCourses: activeCoursesData.length,
        totalRevenue: totalRevenue,
        studentsEnrolled: Math.floor(coursesData.length * 35), // Estimated
        departments: uniqueDepartments.length
      });
      
      setUniversities(universitiesData.slice(0, 3));
      setRecentCourses(coursesData.slice(-5).reverse());
      setChartData(monthlyData);
      setDepartmentData(departmentDistribution.slice(0, 5));
      
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color, bgColor }) => (
    <Card sx={{ 
      background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.12)'
      }
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar sx={{ 
            bgcolor: bgColor,
            width: 56,
            height: 56,
            boxShadow: `0 4px 12px ${color}40`
          }}>
            <Icon sx={{ fontSize: 28, color: color }} />
          </Avatar>
          <Box textAlign="right">
            {change && (
              <Chip 
                size="small"
                label={change}
                sx={{ 
                  bgcolor: change.includes('+') ? '#4caf5022' : '#f4433622',
                  color: change.includes('+') ? '#4caf50' : '#f44336',
                  fontWeight: 600
                }}
              />
            )}
          </Box>
        </Box>
        <Typography variant="h3" fontWeight="bold" sx={{ color }}>
          {title.includes('Revenue') ? `$${(value/1000).toFixed(1)}K` : value}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" mt={2}>
          {change && change.includes('+') ? (
            <TrendingUp sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
          ) : change ? (
            <TrendingDown sx={{ fontSize: 16, color: '#f44336', mr: 0.5 }} />
          ) : null}
          <Typography variant="caption" color="text.secondary">
            {change ? 'Since last month' : 'Total count'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box textAlign="center">
          <LinearProgress sx={{ width: 300, height: 8, borderRadius: 4 }} />
          <Typography variant="h6" mt={2} color="text.secondary">
            Loading University Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your university management portal. Here's an overview of your institution's performance.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            icon={School}
            title="Universities"
            value={stats.totalUniversities}
            change="+12%"
            color="#3f51b5"
            bgColor="#3f51b522"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            icon={MenuBook}
            title="Courses"
            value={stats.totalCourses}
            change="+8%"
            color="#f50057"
            bgColor="#f5005722"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            icon={People}
            title="Active Courses"
            value={stats.activeCourses}
            change="+15%"
            color="#4caf50"
            bgColor="#4caf5022"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            icon={AttachMoney}
            title="Total Revenue"
            value={stats.totalRevenue}
            change="+23%"
            color="#ff9800"
            bgColor="#ff980022"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            icon={LibraryBooks}
            title="Departments"
            value={stats.departments}
            change="+5%"
            color="#00bcd4"
            bgColor="#00bcd422"
          />
        </Grid>
      </Grid>

      {/* Recent Data Section */}
      <Grid container spacing={3}>
        {/* Recent Courses */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            p: 3
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Recently Added Courses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest courses in the system
                </Typography>
              </Box>
              <IconButton>
                <ArrowForward />
              </IconButton>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Code</TableCell>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Fee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentCourses.map((course) => (
                    <TableRow 
                      key={course.id}
                      hover
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04)
                        }
                      }}
                    >
                      <TableCell>
                        <Chip 
                          label={course.courseCode}
                          size="small"
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {course.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course.instructor || 'No instructor'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={course.department}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          ${parseFloat(course.tuitionFee || 0).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* University List & System Status */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {/* Top Universities */}
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                p: 3
              }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Top Universities
                </Typography>
                <Grid container spacing={2}>
                  {universities.map((uni, index) => (
                    <Grid item xs={12} key={uni.id}>
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        p={2}
                        sx={{
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.03),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            borderColor: alpha(theme.palette.primary.main, 0.3)
                          }
                        }}
                      >
                        <Avatar sx={{ 
                          bgcolor: COLORS[index % COLORS.length],
                          mr: 2
                        }}>
                          {uni.name.charAt(0)}
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="body1" fontWeight={600}>
                            {uni.name}
                          </Typography>
                          <Box display="flex" alignItems="center" mt={0.5}>
                            <LocationOn sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {uni.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
            
          </Grid>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box mt={4}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`
        }}>
          
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard;