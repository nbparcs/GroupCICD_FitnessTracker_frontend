import api from './api';

const workoutService = {
  // Get all workouts
  getAllWorkouts: async (params = {}) => {
    const response = await api.get('/workouts/workouts/', { params });
    return response.data;
  },

  // Get a single workout
  getWorkout: async (id) => {
    const response = await api.get(`/workouts/workouts/${id}/`);
    return response.data;
  },

  // Create a new workout
  createWorkout: async (workoutData) => {
    const response = await api.post('/workouts/workouts/', workoutData);
    return response.data;
  },

  // Update a workout
  updateWorkout: async (id, workoutData) => {
    const response = await api.put(`/workouts/workouts/${id}/`, workoutData);
    return response.data;
  },

  // Partial update
  patchWorkout: async (id, workoutData) => {
    const response = await api.patch(`/workouts/workouts/${id}/`, workoutData);
    return response.data;
  },

  // Delete a workout
  deleteWorkout: async (id) => {
    const response = await api.delete(`/workouts/workouts/${id}/`);
    return response.data;
  },

  // Get today's workouts
  getTodayWorkouts: async () => {
    const response = await api.get('/workouts/workouts/today/');
    return response.data;
  },

  // Get this week's workouts
  getWeekWorkouts: async () => {
    const response = await api.get('/workouts/workouts/this_week/');
    return response.data;
  },

  // Get workout summary
  getWorkoutSummary: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get('/workouts/workouts/summary/', { params });
    return response.data;
  },

  // Start a workout
  startWorkout: async (id) => {
    const response = await api.post(`/workouts/workouts/${id}/start/`);
    return response.data;
  },

  // Complete a workout
  completeWorkout: async (id, data = {}) => {
    const response = await api.post(`/workouts/workouts/${id}/complete/`, data);
    return response.data;
  },

  // Skip a workout
  skipWorkout: async (id) => {
    const response = await api.post(`/workouts/workouts/${id}/skip/`);
    return response.data;
  },
};

export default workoutService;
