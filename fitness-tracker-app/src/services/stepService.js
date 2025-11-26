import api from './api';

const stepService = {
  // Daily Steps
  getAllSteps: async (params = {}) => {
    const response = await api.get('/steps/daily/', { params });
    return response.data;
  },

  getStepRecord: async (id) => {
    const response = await api.get(`/steps/daily/${id}/`);
    return response.data;
  },

  getTodaySteps: async () => {
    const response = await api.get('/steps/daily/today/');
    return response.data;
  },

  createStepRecord: async (data) => {
    const response = await api.post('/steps/daily/', data);
    return response.data;
  },

  updateStepRecord: async (id, data) => {
    const response = await api.put(`/steps/daily/${id}/`, data);
    return response.data;
  },

  deleteStepRecord: async (id) => {
    await api.delete(`/steps/daily/${id}/`);
  },

  quickLogSteps: async (steps, source = 'manual') => {
    const response = await api.post('/steps/daily/quick_log/', { steps, source });
    return response.data;
  },

  // Weekly & Monthly Data
  getWeeklySteps: async () => {
    const response = await api.get('/steps/daily/weekly/');
    return response.data;
  },

  getMonthlySteps: async () => {
    const response = await api.get('/steps/daily/monthly/');
    return response.data;
  },

  // Summary & Statistics
  getStepSummary: async (period = 30) => {
    const response = await api.get('/steps/daily/summary/', { params: { period } });
    return response.data;
  },

  getChartData: async (period = 7) => {
    const response = await api.get('/steps/daily/chart_data/', { params: { period } });
    return response.data;
  },

  // Goals
  getStepGoal: async () => {
    const response = await api.get('/steps/goals/current/');
    return response.data;
  },

  updateStepGoal: async (dailyGoal) => {
    const response = await api.post('/steps/goals/', { daily_goal: dailyGoal });
    return response.data;
  },

  // Streaks
  getCurrentStreak: async () => {
    const response = await api.get('/steps/streaks/current/');
    return response.data;
  },

  refreshStreak: async () => {
    const response = await api.post('/steps/streaks/refresh/');
    return response.data;
  },
};

export default stepService;
