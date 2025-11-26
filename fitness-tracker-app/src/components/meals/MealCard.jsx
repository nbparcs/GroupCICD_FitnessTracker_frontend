import React from 'react';
import { Link } from 'react-router-dom';
import './Meals.css';

const MealCard = ({ meal, onDelete }) => {
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

  return (
    <div className="meal-card">
      <div className="meal-card-header">
        <div className="meal-icon" style={{ background: getMealTypeColor(meal.meal_type) }}>
          {getMealIcon(meal.meal_type)}
        </div>
        <div className="meal-header-info">
          <h3>{meal.name}</h3>
          <span className="meal-type-badge" style={{ background: getMealTypeColor(meal.meal_type) }}>
            {meal.meal_type}
          </span>
        </div>
        <div className="meal-time">
          {meal.meal_time ? (
            <span>{new Date(`2000-01-01T${meal.meal_time}`).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}</span>
          ) : (
            <span>{new Date(meal.meal_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}</span>
          )}
        </div>
      </div>
  {meal.description && (
    <p className="meal-description">{meal.description}</p>
  )}

  <div className="meal-nutrition">
    <div className="nutrition-main">
      <div className="calories-display">
        <span className="calories-number">{Math.round(meal.total_calories)}</span>
        <span className="calories-label">calories</span>
      </div>
      
      {meal.servings > 1 && (
        <div className="servings-info">
          <span>{meal.servings}x servings</span>
        </div>
      )}
    </div>

    <div className="macros-grid">
      {meal.protein !== null && (
        <div className="macro-item">
          <span className="macro-icon">💪</span>
          <div className="macro-info">
            <span className="macro-value">{meal.total_protein.toFixed(1)}g</span>
            <span className="macro-label">Protein</span>
          </div>
        </div>
      )}
      {meal.carbohydrates !== null && (
        <div className="macro-item">
          <span className="macro-icon">🌾</span>
          <div className="macro-info">
            <span className="macro-value">{meal.total_carbohydrates.toFixed(1)}g</span>
            <span className="macro-label">Carbs</span>
          </div>
        </div>
      )}
      {meal.fats !== null && (
        <div className="macro-item">
          <span className="macro-icon">🥑</span>
          <div className="macro-info">
            <span className="macro-value">{meal.total_fats.toFixed(1)}g</span>
            <span className="macro-label">Fats</span>
          </div>
        </div>
      )}
    </div>

    {meal.macros_percentage && (
      <div className="macros-bar">
        {meal.macros_percentage.protein > 0 && (
          <div 
            className="macro-segment protein"
            style={{ width: `${meal.macros_percentage.protein}%` }}
            title={`Protein: ${meal.macros_percentage.protein}%`}
          />
        )}
        {meal.macros_percentage.carbs > 0 && (
          <div 
            className="macro-segment carbs"
            style={{ width: `${meal.macros_percentage.carbs}%` }}
            title={`Carbs: ${meal.macros_percentage.carbs}%`}
          />
        )}
        {meal.macros_percentage.fats > 0 && (
          <div 
            className="macro-segment fats"
            style={{ width: `${meal.macros_percentage.fats}%` }}
            title={`Fats: ${meal.macros_percentage.fats}%`}
          />
        )}
      </div>
    )}
  </div>

      <div className="meal-actions">
        <Link to={`/meals/${meal.id}`} className="btn-action btn-view">
          View
        </Link>
        <Link to={`/meals/${meal.id}/edit`} className="btn-action btn-edit">
          Edit
        </Link>
        <button
          className="btn-action btn-delete"
          onClick={() => onDelete(meal.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MealCard;