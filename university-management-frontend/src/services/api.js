import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// University API calls
export const universityAPI = {
  getAllUniversities: () => api.get('/api/university'),
  getUniversityById: (id) => api.get(`/api/university/${id}`),
  createUniversity: (universityData) => api.post('/api/university', universityData),
  updateUniversity: (id, universityData) => api.put(`/api/university/${id}`, universityData),
  deleteUniversity: (id) => api.delete(`/api/university/${id}`),
};

// Course API calls
export const courseAPI = {
  getAllCourses: () => api.get('/api/courses'),
  getCourseById: (id) => api.get(`/api/courses/${id}`),
  getCoursesByUniversityId: (universityId) => api.get(`/api/courses/university/${universityId}`),
  getCoursesByDepartment: (department) => api.get(`/api/courses/department/${department}`),
  getActiveCourses: () => api.get('/api/courses/active'),
  createCourse: (courseData) => api.post('/api/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/api/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/api/courses/${id}`),
};

// Add error interceptor for debugging
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;