import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import workoutService from '../../services/workoutService';
import './Workouts.css';

const WorkoutForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    workout_type: 'running',
    title: '',
    description: '',
    duration: '',
    calories_burned: '',
    distance: '',
    intensity: 'medium',
    status: 'planned',
    notes: '',
    workout_date: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingWorkout, setFetchingWorkout] = useState(false);

  const workoutTypes = [
    { value: 'running', label: 'Running 🏃' },
    { value: 'cycling', label: 'Cycling 🚴' },
    { value: 'swimming', label: 'Swimming 🏊' },
    { value: 'walking', label: 'Walking 🚶' },
    { value: 'gym', label: 'Gym Workout 💪' },
    { value: 'yoga', label: 'Yoga 🧘' },
    { value: 'pilates', label: 'Pilates 🤸' },
    { value: 'hiit', label: 'HIIT 🔥' },
    { value: 'cardio', label: 'Cardio ❤️' },
    { value: 'strength', label: 'Strength Training 🏋️' },
    { value: 'sports', label: 'Sports ⚽' },
    { value: 'other', label: 'Other 🎯' },
  ];

  const fetchWorkout = useCallback(async () => {
    try {
      setFetchingWorkout(true);
      const data = await workoutService.getWorkout(id);
      setFormData({
        workout_type: data.workout_type,
        title: data.title,
        description: data.description || '',
        duration: data.duration || '',
        calories_burned: data.calories_burned || '',
        distance: data.distance || '',
        intensity: data.intensity,
        status: data.status,
        notes: data.notes || '',
        workout_date: data.workout_date,
      });
    } catch (err) {
      setError('Failed to load workout details.');
      console.error('Error fetching workout:', err);
    } finally {
      setFetchingWorkout(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      fetchWorkout();
    }
  }, [isEditMode, fetchWorkout]);

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
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
        calories_burned: formData.calories_burned
          ? parseFloat(formData.calories_burned)
          : null,
        distance: formData.distance ? parseFloat(formData.distance) : null,
      };

      if (isEditMode) {
        await workoutService.updateWorkout(id, submitData);
      } else {
        await workoutService.createWorkout(submitData);
      }

      navigate('/workouts');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setError(errorMessages || 'Failed to save workout. Please try again.');
      } else {
        setError('Failed to save workout. Please try again.');
      }
      console.error('Error saving workout:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingWorkout) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading workout...</p>
      </div>
    );
  }

  return (
    <div className="workout-form-container">
      <div className="workout-form-card">
        <h2>{isEditMode ? 'Edit Workout' : 'Add New Workout'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="workout-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="workout_type">Workout Type *</label>
              <select
                id="workout_type"
                name="workout_type"
                value={formData.workout_type}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {workoutTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="workout_date">Date *</label>
              <input
                type="date"
                id="workout_date"
                name="workout_date"
                value={formData.workout_date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Morning Run"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your workout"
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="30"
                min="1"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="calories_burned">Calories Burned</label>
              <input
                type="number"
                id="calories_burned"
                name="calories_burned"
                value={formData.calories_burned}
                onChange={handleChange}
                placeholder="250"
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="distance">Distance (km)</label>
              <input
                type="number"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="5.0"
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="intensity">Intensity</label>
              <select
                id="intensity"
                name="intensity"
                value={formData.intensity}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about your workout"
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/workouts')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? 'Saving...'
                : isEditMode
                ? 'Update Workout'
                : 'Create Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm;
