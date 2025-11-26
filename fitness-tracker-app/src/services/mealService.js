import api from './api';

const mealService = {
  // Get all meals
  getAllMeals: async (params = {}) => {
    const response = await api.get('/meals/meals/', { params });
    return response.data;
  },

  // Get a single meal
  getMeal: async (id) => {
    const response = await api.get(`/meals/meals/${id}/`);
    return response.data;
  },

  // Create a new meal
  createMeal: async (mealData) => {
    const response = await api.post('/meals/meals/', mealData);
    return response.data;
  },

  // Update a meal
  updateMeal: async (id, mealData) => {
    const response = await api.put(`/meals/meals/${id}/`, mealData);
    return response.data;
  },

  // Partial update
  patchMeal: async (id, mealData) => {
    const response = await api.patch(`/meals/meals/${id}/`, mealData);
    return response.data;
  },

  // Delete a meal
  deleteMeal: async (id) => {
    const response = await api.delete(`/meals/meals/${id}/`);
    return response.data;
  },

  // Get today's meals
  getTodayMeals: async () => {
    const response = await api.get('/meals/meals/today/');
    return response.data;
  },

  // Get yesterday's meals
  getYesterdayMeals: async () => {
    const response = await api.get('/meals/meals/yesterday/');
    return response.data;
  },

  // Get this week's meals
  getWeekMeals: async () => {
    const response = await api.get('/meals/meals/this_week/');
    return response.data;
  },

  // Get meals by specific date
  getMealsByDate: async (date) => {
    const response = await api.get('/meals/meals/by_date/', {
      params: { date }
    });
    return response.data;
  },

  // Get meal summary
  getMealSummary: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get('/meals/meals/summary/', { params });
    return response.data;
  },

  // Get daily summary
  getDailySummary: async (startDate, endDate) => {
    const response = await api.get('/meals/meals/daily_summary/', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data;
  },

  // Food Items
  getAllFoodItems: async (params = {}) => {
    const response = await api.get('/meals/food-items/', { params });
    return response.data;
  },

  getFoodItem: async (id) => {
    const response = await api.get(`/meals/food-items/${id}/`);
    return response.data;
  },

  getFoodCategories: async () => {
    const response = await api.get('/meals/food-items/categories/');
    return response.data;
  },
};

export default mealService;
