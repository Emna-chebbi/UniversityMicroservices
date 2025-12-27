import React, { useState, useEffect } from 'react';
import { courseAPI, universityAPI } from '../services/api';
import {
  Box, Grid, Card, CardContent, Typography, Container,
  LinearProgress, Avatar, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Paper, useTheme, alpha, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Button, Tooltip, Alert, Snackbar, Select,
  MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  MenuBook, Edit, Delete, Add, Search,
  FilterList, MoreVert, AttachMoney, Timer,
  People, School, TrendingUp, CheckCircle,
  Error, Sort
} from '@mui/icons-material';

const CourseList = () => {
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCourse, setCurrentCourse] = useState({
    courseCode: '',
    title: '',
    description: '',
    creditHours: '',
    department: '',
    semester: '',
    academicYear: '',
    instructor: '',
    prerequisites: '',
    tuitionFee: '',
    isActive: true,
    universityId: ''
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchUniversities();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses();
      setCourses(response.data || []);
      setFilteredCourses(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch courses');
      showSnackbar('Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await universityAPI.getAllUniversities();
      setUniversities(response.data || []);
    } catch (err) {
      console.error('Failed to fetch universities', err);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (course = null) => {
    if (course) {
      setCurrentCourse({
        id: course.id,
        courseCode: course.courseCode || '',
        title: course.title || '',
        description: course.description || '',
        creditHours: course.creditHours || '',
        department: course.department || '',
        semester: course.semester || '',
        academicYear: course.academicYear || '',
        instructor: course.instructor || '',
        prerequisites: course.prerequisites || '',
        tuitionFee: course.tuitionFee || '',
        isActive: course.isActive !== undefined ? course.isActive : true,
        universityId: course.universityId || ''
      });
      setEditing(true);
    } else {
      setCurrentCourse({
        courseCode: '',
        title: '',
        description: '',
        creditHours: '',
        department: '',
        semester: '',
        academicYear: '',
        instructor: '',
        prerequisites: '',
        tuitionFee: '',
        isActive: true,
        universityId: ''
      });
      setEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const courseData = {
        ...currentCourse,
        creditHours: parseInt(currentCourse.creditHours) || 0,
        tuitionFee: currentCourse.tuitionFee ? parseFloat(currentCourse.tuitionFee) : null,
        universityId: currentCourse.universityId ? parseInt(currentCourse.universityId) : null
      };

      if (editing) {
        await courseAPI.updateCourse(currentCourse.id, courseData);
        showSnackbar('Course updated successfully!');
      } else {
        await courseAPI.createCourse(courseData);
        showSnackbar('Course created successfully!');
      }
      // Refresh the list after successful save
      await fetchCourses();
      handleCloseDialog();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to save course', 'error');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.deleteCourse(id);
        showSnackbar('Course deleted successfully!');
        // Refresh the list after successful delete
        await fetchCourses();
      } catch (err) {
        showSnackbar(err.response?.data?.message || 'Failed to delete course', 'error');
        console.error(err);
      }
    }
  };

  const getUniversityName = (id) => {
    const uni = universities.find(u => u.id === id);
    return uni ? uni.name : 'Unknown University';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box textAlign="center">
          <LinearProgress sx={{ width: 300, height: 8, borderRadius: 4 }} />
          <Typography variant="h6" mt={2} color="text.secondary">
            Loading Courses...
          </Typography>
        </Box>
      </Box>
    );
  }

  const getRandomColor = () => {
    const colors = ['#3f51b5', '#f50057', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Course Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage all courses across universities
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              boxShadow: '0 8px 32px rgba(63, 81, 181, 0.3)'
            }}
          >
            Add Course
          </Button>
        </Box>

        {/* Search and Filter Bar */}
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          p: 2,
          mb: 3
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              px: 2,
              py: 1
            }}>
              <Search sx={{ color: 'text.secondary', mr: 1 }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Search courses by title, code, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{ ml: 1 }}
              />
            </Box>
            <IconButton sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              borderRadius: 2
            }}>
              <FilterList />
            </IconButton>
            <IconButton sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              borderRadius: 2
            }}>
              <Sort />
            </IconButton>
          </Box>
        </Card>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            p: 3
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#3f51b5">
                  {courses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Total Courses
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: alpha('#3f51b5', 0.1),
                color: '#3f51b5'
              }}>
                <MenuBook />
              </Avatar>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <TrendingUp sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                +{Math.floor(courses.length * 0.15)} this semester
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            p: 3
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#4caf50">
                  ${(courses.reduce((sum, course) => sum + (parseFloat(course.tuitionFee) || 0), 0) / 1000).toFixed(1)}K
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Total Revenue
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: alpha('#4caf50', 0.1),
                color: '#4caf50'
              }}>
                <AttachMoney />
              </Avatar>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            p: 3
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#ff9800">
                  {[...new Set(courses.map(c => c.department))].length}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Departments
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: alpha('#ff9800', 0.1),
                color: '#ff9800'
              }}>
                <People />
              </Avatar>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            p: 3
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#f50057">
                  {Math.floor(courses.reduce((acc, course) => acc + (course.creditHours || 0), 0) / courses.length) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Avg. Credit Hours
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: alpha('#f50057', 0.1),
                color: '#f50057'
              }}>
                <Timer />
              </Avatar>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Courses Table */}
      <Card sx={{ 
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          p: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Typography variant="h6" fontWeight="bold">
            All Courses ({filteredCourses.length})
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Course Details</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>University</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Details</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow 
                  key={course.id}
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Avatar sx={{ 
                          bgcolor: getRandomColor(),
                          mr: 2,
                          width: 36,
                          height: 36
                        }}>
                          {course.courseCode?.charAt(0) || 'C'}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {course.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.courseCode}
                          </Typography>
                        </Box>
                      </Box>
                      {course.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {course.description.length > 60 ? `${course.description.substring(0, 60)}...` : course.description}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip 
                      label={course.department}
                      size="small"
                      sx={{ 
                        bgcolor: alpha('#3f51b5', 0.1),
                        color: '#3f51b5',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center">
                      <School sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {getUniversityName(course.universityId)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Timer sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption">
                          {course.creditHours || 0} credits
                        </Typography>
                      </Box>
                      {course.instructor && (
                        <Box display="flex" alignItems="center">
                          <People sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {course.instructor}
                          </Typography>
                        </Box>
                      )}
                      {course.tuitionFee && (
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <AttachMoney sx={{ fontSize: 14, mr: 0.5, color: '#4caf50' }} />
                          <Typography variant="caption" fontWeight={500} color="#4caf50">
                            ${parseFloat(course.tuitionFee).toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2)
                            }
                          }}
                          onClick={() => handleOpenDialog(course)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          sx={{ 
                            bgcolor: alpha('#f44336', 0.1),
                            color: '#f44336',
                            '&:hover': {
                              bgcolor: alpha('#f44336', 0.2)
                            }
                          }}
                          onClick={() => handleDelete(course.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        sx={{ 
                          bgcolor: alpha(theme.palette.divider, 0.1),
                          color: 'text.secondary'
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredCourses.length === 0 && (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <MenuBook sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No courses found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try a different search term' : 'Add your first course to get started'}
            </Typography>
          </Box>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Box display="flex" alignItems="center">
            <MenuBook sx={{ mr: 1.5, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight={600}>
              {editing ? 'Edit Course' : 'Add New Course'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Course Code"
                name="courseCode"
                value={currentCourse.courseCode}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Credit Hours"
                name="creditHours"
                type="number"
                value={currentCourse.creditHours}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                name="title"
                value={currentCourse.title}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={currentCourse.description || ''}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={currentCourse.department}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Semester"
                name="semester"
                value={currentCourse.semester}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Academic Year"
                name="academicYear"
                value={currentCourse.academicYear}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tuition Fee"
                name="tuitionFee"
                type="number"
                value={currentCourse.tuitionFee}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                inputProps={{ step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instructor"
                name="instructor"
                value={currentCourse.instructor || ''}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prerequisites"
                name="prerequisites"
                value={currentCourse.prerequisites || ''}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>University</InputLabel>
                <Select
                  name="universityId"
                  value={currentCourse.universityId || ''}
                  onChange={handleInputChange}
                  label="University"
                >
                  <MenuItem value="">Select University</MenuItem>
                  {universities.map((uni) => (
                    <MenuItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.02)
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha(theme.palette.divider, 0.1) }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              borderRadius: 2,
              px: 4,
              boxShadow: '0 4px 16px rgba(63, 81, 181, 0.2)'
            }}
          >
            {editing ? 'Update' : 'Create'} Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseList;