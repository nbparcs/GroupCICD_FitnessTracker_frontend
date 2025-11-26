import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import mealService from '../../services/mealService';
import './Meals.css';

const MealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMeal = useCallback(async () => {
    try {
      setLoading(true);
      const data = await mealService.getMeal(id);
      setMeal(data);
    } catch (err) {
      setError('Failed to load meal details.');
      console.error('Error fetching meal:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMeal();
  }, [fetchMeal]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await mealService.deleteMeal(id);
        navigate('/meals');
      } catch (err) {
        setError('Failed to delete meal.');
        console.error('Error deleting meal:', err);
      }
    }
  };

  const getMealIcon = (type) => {
    const icons = {
      breakfast: '🍳',
      lunch: '🥗',
      dinner: '🍽️',
      snack: '🍎',
      other: '🍴',
    };
    return icons[type] || '🍴';
  };

  const getMealTypeColor = (type) => {
    const colors = {
      breakfast: '#ff9800',
      lunch: '#4caf50',
      dinner: '#2196f3',
      snack: '#9c27b0',
      other: '#607d8b',
    };
    return colors[type] || '#607d8b';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading meal details...</p>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="error-container">
        <div className="error-message">{error || 'Meal not found'}</div>
        <Link to="/meals" className="btn-primary">
          Back to Meals
        </Link>
      </div>
    );
  }

  return (
    <div className="meal-detail-container">
      <div className="meal-detail-card">
        <div className="detail-header">
          <div className="detail-title-section">
            <div 
              className="detail-icon"
              style={{ background: getMealTypeColor(meal.meal_type) }}
            >
              {getMealIcon(meal.meal_type)}
            </div>
            <div>
              <h1>{meal.name}</h1>
              <div className="detail-meta">
                <span className="meal-type-badge" style={{ background: getMealTypeColor(meal.meal_type) }}>
                  {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}
                </span>
                <span className="detail-date">
                  {new Date(meal.meal_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {meal.meal_time && ` at ${new Date(`2000-01-01T${meal.meal_time}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {meal.photo_url && (
          <div className="meal-photo">
<img src={meal.photo_url} alt={meal.name} /> </div> )}
    {meal.description && (
      <div className="detail-section">
        <h3>Description</h3>
        <p>{meal.description}</p>
      </div>
    )}

    <div className="detail-section">
      <h3>Serving Information</h3>
      <div className="detail-grid">
        {meal.serving_size && (
          <div className="detail-item">
            <span className="detail-label">Serving Size</span>
            <span className="detail-value">{meal.serving_size}</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Number of Servings</span>
          <span className="detail-value">{meal.servings}</span>
        </div>
      </div>
    </div>

    <div className="detail-section">
      <h3>Nutritional Information</h3>
      
      <div className="nutrition-summary">
        <div className="nutrition-card primary">
          <div className="nutrition-icon">🔥</div>
          <div className="nutrition-content">
            <div className="nutrition-value">{Math.round(meal.total_calories)}</div>
            <div className="nutrition-label">Total Calories</div>
            <div className="nutrition-sublabel">{Math.round(meal.calories)} per serving</div>
          </div>
        </div>
      </div>

      <div className="macros-detail-grid">
        {meal.protein !== null && (
          <div className="macro-detail-card">
            <div className="macro-detail-icon">💪</div>
            <div className="macro-detail-content">
              <div className="macro-detail-label">Protein</div>
              <div className="macro-detail-value">{meal.total_protein.toFixed(1)}g</div>
              <div className="macro-detail-sublabel">{parseFloat(meal.protein).toFixed(1)}g per serving</div>
              <div className="macro-percentage">{meal.macros_percentage.protein}% of calories</div>
            </div>
          </div>
        )}

        {meal.carbohydrates !== null && (
          <div className="macro-detail-card">
            <div className="macro-detail-icon">🌾</div>
            <div className="macro-detail-content">
              <div className="macro-detail-label">Carbohydrates</div>
              <div className="macro-detail-value">{meal.total_carbohydrates.toFixed(1)}g</div>
              <div className="macro-detail-sublabel">{parseFloat(meal.carbohydrates).toFixed(1)}g per serving</div>
              <div className="macro-percentage">{meal.macros_percentage.carbs}% of calories</div>
            </div>
          </div>
        )}

        {meal.fats !== null && (
          <div className="macro-detail-card">
            <div className="macro-detail-icon">🥑</div>
            <div className="macro-detail-content">
              <div className="macro-detail-label">Fats</div>
              <div className="macro-detail-value">{meal.total_fats.toFixed(1)}g</div>
              <div className="macro-detail-sublabel">{parseFloat(meal.fats).toFixed(1)}g per serving</div>
              <div className="macro-percentage">{meal.macros_percentage.fats}% of calories</div>
            </div>
          </div>
        )}
      </div>

      {meal.macros_percentage && (
        <div className="macros-visualization-detail">
          <h4>Macronutrient Distribution</h4>
          <div className="macros-bar-large">
            {meal.macros_percentage.protein > 0 && (
              <div 
                className="macro-segment-large protein"
                style={{ width: `${meal.macros_percentage.protein}%` }}
                title={`Protein: ${meal.macros_percentage.protein}%`}
              >
                {meal.macros_percentage.protein > 10 && (
                  <span className="macro-label-large">{meal.macros_percentage.protein}%</span>
                )}
              </div>
            )}
            {meal.macros_percentage.carbs > 0 && (
              <div 
                className="macro-segment-large carbs"
                style={{ width: `${meal.macros_percentage.carbs}%` }}
                title={`Carbs: ${meal.macros_percentage.carbs}%`}
              >
                {meal.macros_percentage.carbs > 10 && (
                  <span className="macro-label-large">{meal.macros_percentage.carbs}%</span>
                )}
              </div>
            )}
            {meal.macros_percentage.fats > 0 && (
              <div 
                className="macro-segment-large fats"
                style={{ width: `${meal.macros_percentage.fats}%` }}
                title={`Fats: ${meal.macros_percentage.fats}%`}
              >
                {meal.macros_percentage.fats > 10 && (
                  <span className="macro-label-large">{meal.macros_percentage.fats}%</span>
                )}
              </div>
            )}
          </div>
          <div className="macros-legend">
            <div className="legend-item">
              <span className="legend-color protein"></span>
              <span>Protein</span>
            </div>
            <div className="legend-item">
              <span className="legend-color carbs"></span>
              <span>Carbs</span>
            </div>
            <div className="legend-item">
              <span className="legend-color fats"></span>
              <span>Fats</span>
            </div>
          </div>
        </div>
      )}

      {(meal.fiber !== null || meal.sugar !== null || meal.sodium !== null) && (
        <div className="additional-nutrition">
          <h4>Additional Nutrients</h4>
          <div className="detail-grid">
            {meal.fiber !== null && (
              <div className="detail-item">
                <span className="detail-label">Fiber</span>
                <span className="detail-value">
                  {(parseFloat(meal.fiber) * parseFloat(meal.servings)).toFixed(1)}g
                </span>
              </div>
            )}
            {meal.sugar !== null && (
              <div className="detail-item">
                <span className="detail-label">Sugar</span>
                <span className="detail-value">
                  {(parseFloat(meal.sugar) * parseFloat(meal.servings)).toFixed(1)}g
                </span>
              </div>
            )}
            {meal.sodium !== null && (
              <div className="detail-item">
                <span className="detail-label">Sodium</span>
                <span className="detail-value">
                  {(parseFloat(meal.sodium) * parseFloat(meal.servings)).toFixed(1)}mg
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>

    {meal.notes && (
      <div className="detail-section">
        <h3>Notes</h3>
        <div className="meal-notes">
          <p>{meal.notes}</p>
        </div>
      </div>
    )}

    <div className="detail-section">
      <h3>Timestamps</h3>
      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Created</span>
          <span className="detail-value">
            {new Date(meal.created_at).toLocaleString()}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Last Updated</span>
          <span className="detail-value">
            {new Date(meal.updated_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>

    <div className="detail-actions">
      <Link to="/meals" className="btn-secondary">
        Back to List
      </Link>
      <Link to={`/meals/${meal.id}/edit`} className="btn-primary">
        Edit Meal
      </Link>
      <button className="btn-danger" onClick={handleDelete}>
        Delete Meal
      </button>
    </div>
  </div>
</div>
);
};

export default MealDetail;