import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import mealService from '../../services/mealService';
import './Meals.css';
import { useLocation } from 'react-router-dom';

const MealForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const location = useLocation();

  const [formData, setFormData] = useState({
    meal_type: 'breakfast',
    name: '',
    description: '',
    calories: '',
    protein: '',
    carbohydrates: '',
    fats: '',
    fiber: '',
    sugar: '',
    sodium: '',
    serving_size: '',
    servings: '1',
    meal_date: new Date().toISOString().split('T')[0],
    meal_time: '',
    notes: '',
    photo_url: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingMeal, setFetchingMeal] = useState(false);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast 🍳' },
    { value: 'lunch', label: 'Lunch 🥗' },
    { value: 'dinner', label: 'Dinner 🍽️' },
    { value: 'snack', label: 'Snack 🍎' },
    { value: 'other', label: 'Other 🍴' },
  ];

  const fetchMeal = useCallback(async () => {
    try {
      setFetchingMeal(true);
      const data = await mealService.getMeal(id);
      setFormData({
        meal_type: data.meal_type,
        name: data.name,
        description: data.description || '',
        calories: data.calories || '',
        protein: data.protein || '',
        carbohydrates: data.carbohydrates || '',
        fats: data.fats || '',
        fiber: data.fiber || '',
        sugar: data.sugar || '',
        sodium: data.sodium || '',
        serving_size: data.serving_size || '',
        servings: data.servings || '1',
        meal_date: data.meal_date,
        meal_time: data.meal_time || '',
        notes: data.notes || '',
        photo_url: data.photo_url || '',
      });
    } catch (err) {
      setError('Failed to load meal details.');
      console.error('Error fetching meal:', err);
    } finally {
      setFetchingMeal(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      fetchMeal();
    } else if (location.state?.prefillData) {
      // Pre-fill form with food item data
      setFormData(prev => ({
        ...prev,
        ...location.state.prefillData,
        meal_date: new Date().toISOString().split('T')[0],
        servings: '1',
      }));
    }
  }, [isEditMode, fetchMeal, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Meal name is required');
      setLoading(false);
      return;
    }

    if (!formData.calories || parseFloat(formData.calories) <= 0) {
      setError('Calories must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        calories: parseFloat(formData.calories),
        protein: formData.protein ? parseFloat(formData.protein) : null,
        carbohydrates: formData.carbohydrates ? parseFloat(formData.carbohydrates) : null,
        fats: formData.fats ? parseFloat(formData.fats) : null,
        fiber: formData.fiber ? parseFloat(formData.fiber) : null,
        sugar: formData.sugar ? parseFloat(formData.sugar) : null,
        sodium: formData.sodium ? parseFloat(formData.sodium) : null,
        servings: parseFloat(formData.servings),
        meal_time: formData.meal_time || null,
        description: formData.description || null,
        notes: formData.notes || null,
        photo_url: formData.photo_url || null,
        serving_size: formData.serving_size || null,
      };

      if (isEditMode) {
        await mealService.updateMeal(id, submitData);
      } else {
        await mealService.createMeal(submitData);
      }

      navigate('/meals');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setError(errorMessages || 'Failed to save meal. Please try again.');
      } else {
        setError('Failed to save meal. Please try again.');
      }
      console.error('Error saving meal:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingMeal) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading meal...</p>
      </div>
    );
  }

  return (
    <div className="meal-form-container">
      <div className="meal-form-card">
        <div className="form-header">
          <h2>{isEditMode ? 'Edit Meal' : 'Log New Meal'}</h2>
          <Link to="/meals/food-items" className="btn-secondary-small">
            Browse Food Database
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="meal-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="meal_type">Meal Type *</label>
                <select
                  id="meal_type"
                  name="meal_type"
                  value={formData.meal_type}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  {mealTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="meal_date">Date *</label>
                <input
                  type="date"
                  id="meal_date"
                  name="meal_date"
                  value={formData.meal_date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="meal_time">Time (Optional)</label>
                <input
                  type="time"
                  id="meal_time"
                  name="meal_time"
                  value={formData.meal_time}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">Meal Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Grilled Chicken Salad"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your meal"
                rows="2"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Nutritional Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="serving_size">Serving Size</label>
                <input
                  type="text"
                  id="serving_size"
                  name="serving_size"
                  value={formData.serving_size}
                  onChange={handleChange}
                  placeholder="e.g., 1 cup, 100g"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="servings">Number of Servings *</label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  placeholder="1"
                  min="0.1"
                  step="0.1"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="nutrition-note">
              <strong>Note:</strong> Enter nutritional values per serving. Total values will be calculated automatically.
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="calories">Calories (kcal) *</label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="250"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="protein">Protein (g)</label>
                <input
                  type="number"
                  id="protein"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  placeholder="20"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="carbohydrates">Carbohydrates (g)</label>
                <input
                  type="number"
                  id="carbohydrates"
                  name="carbohydrates"
                  value={formData.carbohydrates}
                  onChange={handleChange}
                  placeholder="30"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="fats">Fats (g)</label>
                <input
                  type="number"
                  id="fats"
                  name="fats"
                  value={formData.fats}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fiber">Fiber (g)</label>
                <input
                  type="number"
                  id="fiber"
                  name="fiber"
                  value={formData.fiber}
                  onChange={handleChange}
                  placeholder="5"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sugar">Sugar (g)</label>
                <input
                  type="number"
                  id="sugar"
                  name="sugar"
                  value={formData.sugar}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sodium">Sodium (mg)</label>
                <input
                  type="number"
                  id="sodium"
                  name="sodium"
                  value={formData.sodium}
                  onChange={handleChange}
                  placeholder="200"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about this meal"
                rows="3"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo_url">Photo URL (Optional)</label>
              <input
                type="url"
                id="photo_url"
                name="photo_url"
                value={formData.photo_url}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/meals')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? 'Saving...'
                : isEditMode
                ? 'Update Meal'
                : 'Log Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealForm;
