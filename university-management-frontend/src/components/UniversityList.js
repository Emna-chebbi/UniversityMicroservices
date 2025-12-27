import React, { useState, useEffect } from 'react';
import { universityAPI } from '../services/api';
import {
  Box, Grid, Card, CardContent, Typography, Container,
  LinearProgress, Avatar, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Paper, useTheme, alpha, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Button, Tooltip, Alert, Snackbar
} from '@mui/material';
import {
  School, Edit, Delete, Add, LocationOn,
  Email, Phone, Language, CalendarToday,
  Search, FilterList, MoreVert, CheckCircle,
  TrendingUp, People
} from '@mui/icons-material';

const UniversityList = () => {
  const theme = useTheme();
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUniversity, setCurrentUniversity] = useState({
    name: '',
    location: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    establishedYear: '',
    departments: [],
    faculties: []
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    const filtered = universities.filter(uni =>
      uni.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUniversities(filtered);
  }, [searchTerm, universities]);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await universityAPI.getAllUniversities();
      setUniversities(response.data || []);
      setFilteredUniversities(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch universities');
      showSnackbar('Failed to fetch universities', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (university = null) => {
    if (university) {
      setCurrentUniversity({
        id: university.id,
        name: university.name || '',
        location: university.location || '',
        website: university.website || '',
        contactEmail: university.contactEmail || '',
        contactPhone: university.contactPhone || '',
        establishedYear: university.establishedYear || '',
        departments: university.departments || [],
        faculties: university.faculties || []
      });
      setEditing(true);
    } else {
      setCurrentUniversity({
        name: '',
        location: '',
        website: '',
        contactEmail: '',
        contactPhone: '',
        establishedYear: '',
        departments: [],
        faculties: []
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
    setCurrentUniversity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await universityAPI.updateUniversity(currentUniversity.id, currentUniversity);
        showSnackbar('University updated successfully!');
      } else {
        await universityAPI.createUniversity(currentUniversity);
        showSnackbar('University created successfully!');
      }
      // Refresh the list after successful save
      await fetchUniversities();
      handleCloseDialog();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to save university', 'error');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      try {
        await universityAPI.deleteUniversity(id);
        showSnackbar('University deleted successfully!');
        // Refresh the list after successful delete
        await fetchUniversities();
      } catch (err) {
        showSnackbar(err.response?.data?.message || 'Failed to delete university', 'error');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box textAlign="center">
          <LinearProgress sx={{ width: 300, height: 8, borderRadius: 4 }} />
          <Typography variant="h6" mt={2} color="text.secondary">
            Loading Universities...
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
              University Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage all universities in the system
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
            Add University
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
                placeholder="Search universities by name or location..."
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
                  {universities.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Total Universities
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: alpha('#3f51b5', 0.1),
                color: '#3f51b5'
              }}>
                <School />
              </Avatar>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <TrendingUp sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                +{Math.floor(universities.length * 0.12)} this year
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
                  {universities.filter(u => u.establishedYear > 2000).length}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Modern Universities
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: alpha('#4caf50', 0.1),
                color: '#4caf50'
              }}>
                <CheckCircle />
              </Avatar>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <People sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                Established after 2000
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
                <Typography variant="h4" fontWeight="bold" color="#ff9800">
                  {[...new Set(universities.map(u => u.location))].length}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Locations
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: alpha('#ff9800', 0.1),
                color: '#ff9800'
              }}>
                <LocationOn />
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
                  {Math.floor(universities.reduce((acc, uni) => acc + (uni.departments?.length || 0), 0) / universities.length) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Avg. Departments
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: alpha('#f50057', 0.1),
                color: '#f50057'
              }}>
                <People />
              </Avatar>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Universities Table */}
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
            All Universities ({filteredUniversities.length})
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>University</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Established</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUniversities.map((university) => (
                <TableRow 
                  key={university.id}
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
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ 
                        bgcolor: getRandomColor(),
                        mr: 2,
                        width: 40,
                        height: 40
                      }}>
                        {university.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {university.name}
                        </Typography>
                        {university.website && (
                          <Box display="flex" alignItems="center" mt={0.5}>
                            <Language sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {university.website.replace('https://', '')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {university.location}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box>
                      {university.contactEmail && (
                        <Box display="flex" alignItems="center" mb={0.5}>
                          <Email sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {university.contactEmail}
                          </Typography>
                        </Box>
                      )}
                      {university.contactPhone && (
                        <Box display="flex" alignItems="center">
                          <Phone sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption">
                            {university.contactPhone}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip 
                      icon={<CalendarToday sx={{ fontSize: 14 }} />}
                      label={university.establishedYear || 'N/A'}
                      size="small"
                      variant="outlined"
                    />
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
                          onClick={() => handleOpenDialog(university)}
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
                          onClick={() => handleDelete(university.id)}
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

        {filteredUniversities.length === 0 && (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <School sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No universities found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try a different search term' : 'Add your first university to get started'}
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
            <School sx={{ mr: 1.5, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight={600}>
              {editing ? 'Edit University' : 'Add New University'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="University Name"
                name="name"
                value={currentUniversity.name}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={currentUniversity.location}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={currentUniversity.website || ''}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                placeholder="https://example.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Established Year"
                name="establishedYear"
                type="number"
                value={currentUniversity.establishedYear || ''}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={currentUniversity.contactEmail || ''}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="contactPhone"
                value={currentUniversity.contactPhone || ''}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
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
            {editing ? 'Update' : 'Create'} University
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

export default UniversityList;