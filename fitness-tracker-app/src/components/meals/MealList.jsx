import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import mealService from '../../services/mealService';
import MealCard from './MealCard';
import NutritionStats from './NutritionStats';
import './Meals.css';

const MealList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      
      if (filter === 'today') {
        data = await mealService.getTodayMeals();
      } else if (filter === 'yesterday') {
        data = await mealService.getYesterdayMeals();
      } else if (filter === 'week') {
        data = await mealService.getWeekMeals();
      } else if (filter === 'date') {
        data = await mealService.getMealsByDate(selectedDate);
      } else if (filter === 'all') {
        data = await mealService.getAllMeals();
      } else {
        // Filter by meal type
        const params = { meal_type: filter };
        data = await mealService.getAllMeals(params);
      }
      
      setMeals(data);
      setError('');
    } catch (err) {
      setError('Failed to load meals. Please try again.');
      console.error('Error fetching meals:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, selectedDate]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await mealService.deleteMeal(id);
        setMeals(meals.filter(meal => meal.id !== id));
      } catch (err) {
        setError('Failed to delete meal.');
        console.error('Error deleting meal:', err);
      }
    }
  };

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group meals by meal type
  const groupedMeals = filteredMeals.reduce((acc, meal) => {
    if (!acc[meal.meal_type]) {
      acc[meal.meal_type] = [];
    }
    acc[meal.meal_type].push(meal);
    return acc;
  }, {});

  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack', 'other'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading meals...</p>
      </div>
    );
  }

  return (
    <div className="meals-container">
      <div className="meals-header">
        <h1>My Meals</h1>
        <div className="header-actions">
          <Link to="/meals/food-items" className="btn-secondary">
            Browse Foods
          </Link>
          <Link to="/meals/new" className="btn-primary">
            + Log Meal
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <NutritionStats filter={filter} selectedDate={selectedDate} />

      <div className="meals-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
              onClick={() => setFilter('today')}
            >
              Today
            </button>
            <button
              className={`filter-btn ${filter === 'yesterday' ? 'active' : ''}`}
              onClick={() => setFilter('yesterday')}
            >
              Yesterday
            </button>
            <button
              className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
              onClick={() => setFilter('week')}
            >
              This Week
            </button>
            <button
              className={`filter-btn ${filter === 'date' ? 'active' : ''}`}
              onClick={() => setFilter('date')}
            >
              Specific Date
            </button>
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
          </div>

          {filter === 'date' && (
            <div className="date-picker-section">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="date-input"
              />
            </div>
          )}
        </div>

        <div className="meal-type-filters">
          <button
            className={`meal-type-btn ${filter === 'breakfast' ? 'active' : ''}`}
            onClick={() => setFilter('breakfast')}
          >
            🍳 Breakfast
          </button>
          <button
            className={`meal-type-btn ${filter === 'lunch' ? 'active' : ''}`}
            onClick={() => setFilter('lunch')}
          >
            🥗 Lunch
          </button>
          <button
            className={`meal-type-btn ${filter === 'dinner' ? 'active' : ''}`}
            onClick={() => setFilter('dinner')}
          >
            🍽️ Dinner
          </button>
          <button
            className={`meal-type-btn ${filter === 'snack' ? 'active' : ''}`}
            onClick={() => setFilter('snack')}
          >
            🍎 Snack
          </button>
        </div>
      </div>

      {filteredMeals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No meals found</h3>
          <p>Start tracking your nutrition by logging your first meal!</p>
          <Link to="/meals/new" className="btn-primary">
            Log Your First Meal
          </Link>
        </div>
      ) : (
        <div className="meals-content">
          {mealTypeOrder.map(mealType => {
            const mealsOfType = groupedMeals[mealType];
            if (!mealsOfType || mealsOfType.length === 0) return null;

            return (
              <div key={mealType} className="meal-type-section">
                <h2 className="meal-type-heading">
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  <span className="meal-count">({mealsOfType.length})</span>
                </h2>
                <div className="meals-grid">
                  {mealsOfType.map(meal => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MealList;
