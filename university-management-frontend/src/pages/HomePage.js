import React from 'react';
import { 
  Box, Typography, Container, Grid, Card, CardContent,
  useTheme, alpha
} from '@mui/material';
import { 
  School, MenuBook, Dashboard
} from '@mui/icons-material';

const HomePage = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <School />,
      title: 'University Management',
      description: 'Easily manage universities, campuses, and academic programs',
      color: '#3f51b5'
    },
    {
      icon: <MenuBook />,
      title: 'Course Catalog',
      description: 'Comprehensive course management with detailed descriptions',
      color: '#f50057'
    },
    
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 4, md: 6 },
          borderRadius: 2,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                lineHeight: 1.2,
                mb: 2
              }}
            >
              Modern University
              <Box component="span" sx={{ color: '#ffd740', display: 'block' }}>
                Management Platform
              </Box>
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9,
                fontWeight: 300,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Streamline academic operations with our comprehensive university management solution. 
              Built for efficiency, designed for excellence.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Everything You Need
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ maxWidth: 600, margin: '0 auto', fontSize: '1rem' }}
          >
            Comprehensive tools to manage every aspect of your academic institution
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={4} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(feature.color, 0.15)}`
                  }
                }}
              >
                <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${feature.color} 0%, ${alpha(feature.color, 0.7)} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      color: 'white'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: '1rem', mb: 1 }}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;