import React, { useState, useEffect, useCallback } from 'react';
import mealService from '../../services/mealService';
import './Meals.css';

const NutritionStats = ({ filter, selectedDate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date();
      let startDate, endDate;

      if (period === 'today') {
        startDate = today.toISOString().split('T')[0];
        endDate = startDate;
      } else if (period === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        startDate = weekStart.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
      } else if (period === 'month') {
        const monthStart = new Date(today);
        monthStart.setMonth(today.getMonth() - 1);
        startDate = monthStart.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
      }

      const data = await mealService.getMealSummary(startDate, endDate);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="stats-container">
        <div className="stats-loading">Loading nutrition statistics...</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="nutrition-stats-container">
      <div className="stats-header">
        <h2>Nutrition Summary</h2>
        <div className="period-selector">
          <button
            className={`period-btn ${period === 'today' ? 'active' : ''}`}
            onClick={() => setPeriod('today')}
          >
            Today
          </button>
          <button
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            Week
          </button>
          <button
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            Month
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box calories-box">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-label">Total Calories</div>
            <div className="stat-number">{Math.round(stats.total_calories)}</div>
            <div className="stat-sublabel">
              {stats.total_meals > 0 && (
                <span>{Math.round(stats.avg_calories_per_meal)} avg/meal</span>
              )}
            </div>
          </div>
        </div>

        <div className="stat-box protein-box">
          <div className="stat-icon">💪</div>
          <div className="stat-content">
            <div className="stat-label">Protein</div>
            <div className="stat-number">{parseFloat(stats.total_protein).toFixed(1)}g</div>
            <div className="stat-sublabel">
              {stats.macros_percentage.protein}% of calories
            </div>
          </div>
        </div>

        <div className="stat-box carbs-box">
          <div className="stat-icon">🌾</div>
          <div className="stat-content">
            <div className="stat-label">Carbohydrates</div>
            <div className="stat-number">{parseFloat(stats.total_carbohydrates).toFixed(1)}g</div>
            <div className="stat-sublabel">
              {stats.macros_percentage.carbs}% of calories
            </div>
          </div>
        </div>

        <div className="stat-box fats-box">
          <div className="stat-icon">🥑</div>
          <div className="stat-content">
            <div className="stat-label">Fats</div>
            <div className="stat-number">{parseFloat(stats.total_fats).toFixed(1)}g</div>
            <div className="stat-sublabel">
              {stats.macros_percentage.fats}% of calories
            </div>
          </div>
        </div>

        <div className="stat-box meals-box">
          <div className="stat-icon">🍽️</div>
          <div className="stat-content">
            <div className="stat-label">Total Meals</div>
            <div className="stat-number">{stats.total_meals}</div>
          </div>
        </div>

        {stats.total_fiber > 0 && (
          <div className="stat-box fiber-box">
            <div className="stat-icon">🥬</div>
            <div className="stat-content">
              <div className="stat-label">Fiber</div>
              <div className="stat-number">{parseFloat(stats.total_fiber).toFixed(1)}g</div>
            </div>
          </div>
        )}
      </div>

      {stats.macros_percentage && (
        <div className="macros-visualization">
          <h3>Macronutrient Distribution</h3>
          <div className="macros-bar-large">
            <div 
              className="macro-segment-large protein"
              style={{ width: `${stats.macros_percentage.protein}%` }}
            >
              <span className="macro-label-large">
                {stats.macros_percentage.protein > 10 && `${stats.macros_percentage.protein}%`}
              </span>
            </div>
            <div 
              className="macro-segment-large carbs"
              style={{ width: `${stats.macros_percentage.carbs}%` }}
            >
              <span className="macro-label-large">
                {stats.macros_percentage.carbs > 10 && `${stats.macros_percentage.carbs}%`}
              </span>
            </div>
            <div 
              className="macro-segment-large fats"
              style={{ width: `${stats.macros_percentage.fats}%` }}
            >
              <span className="macro-label-large">
                {stats.macros_percentage.fats > 10 && `${stats.macros_percentage.fats}%`}
              </span>
            </div>
          </div>
          <div className="macros-legend">
            <div className="legend-item">
              <span className="legend-color protein"></span>
              <span>Protein ({stats.macros_percentage.protein}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color carbs"></span>
              <span>Carbs ({stats.macros_percentage.carbs}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color fats"></span>
              <span>Fats ({stats.macros_percentage.fats}%)</span>
            </div>
          </div>
        </div>
      )}

      {stats.meal_types_breakdown && Object.keys(stats.meal_types_breakdown).length > 0 && (
        <div className="meal-types-breakdown">
          <h3>Meals by Type</h3>
          <div className="breakdown-grid">
            {Object.entries(stats.meal_types_breakdown).map(([type, count]) => (
              <div key={type} className="breakdown-item">
                <span className="breakdown-label">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <span className="breakdown-value">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionStats;
