import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import workoutService from '../../services/workoutService';
import './Workouts.css';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWorkout = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workoutService.getWorkout(id);
      setWorkout(data);
    } catch (err) {
      setError('Failed to load workout details.');
      console.error('Error fetching workout:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkout();
  }, [fetchWorkout]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutService.deleteWorkout(id);
        navigate('/workouts');
      } catch (err) {
        setError('Failed to delete workout.');
        console.error('Error deleting workout:', err);
      }
    }
  };

  const handleStatusChange = async (action) => {
    try {
      let updatedWorkout;
      
      switch (action) {
        case 'start':
          updatedWorkout = await workoutService.startWorkout(id);
          break;
        case 'complete':
          updatedWorkout = await workoutService.completeWorkout(id);
          break;
        case 'skip':
          updatedWorkout = await workoutService.skipWorkout(id);
          break;
        default:
          return;
      }
      
      setWorkout(updatedWorkout);
    } catch (err) {
      setError(`Failed to ${action} workout.`);
      console.error(`Error ${action} workout:`, err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading workout details...</p>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="error-container">
        <div className="error-message">{error || 'Workout not found'}</div>
        <Link to="/workouts" className="btn-primary">
          Back to Workouts
        </Link>
      </div>
    );
  }

  const getWorkoutIcon = (type) => {
    const icons = {
      running: '🏃',
      cycling: '🚴',
      swimming: '🏊',
      walking: '🚶',
      gym: '💪',
      yoga: '🧘',
      pilates: '🤸',
      hiit: '🔥',
      cardio: '❤️',
      strength: '🏋️',
      sports: '⚽',
      other: '🎯',
    };
    return icons[type] || '🎯';
  };

  const getStatusBadge = (status) => {
    const badges = {
      planned: { text: 'Planned', class: 'status-planned' },
      in_progress: { text: 'In Progress', class: 'status-progress' },
      completed: { text: 'Completed', class: 'status-completed' },
      skipped: { text: 'Skipped', class: 'status-skipped' },
    };
    return badges[status] || badges.planned;
  };

  const statusBadge = getStatusBadge(workout.status);

  return (
    <div className="workout-detail-container">
      <div className="workout-detail-card">
        <div className="detail-header">
          <div className="detail-title-section">
            <div className="detail-icon">
              {getWorkoutIcon(workout.workout_type)}
            </div>
            <div>
              <h1>{workout.title}</h1>
              <p className="detail-date">
                {new Date(workout.workout_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <span className={`status-badge ${statusBadge.class}`}>
            {statusBadge.text}
          </span>
        </div>

        {workout.description && (
          <div className="detail-section">
            <h3>Description</h3>
            <p>{workout.description}</p>
          </div>
        )}

        <div className="detail-section">
          <h3>Workout Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Type</span>
              <span className="detail-value">
                {workout.workout_type.charAt(0).toUpperCase() +
                  workout.workout_type.slice(1)}
              </span>
            </div>
            {workout.duration && (
              <div className="detail-item">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{workout.duration_display}</span>
              </div>
            )}
            {workout.calories_burned && (
              <div className="detail-item">
                <span className="detail-label">Calories Burned</span>
                <span className="detail-value">{workout.calories_burned} cal</span>
              </div>
            )}
            {workout.distance && (
              <div className="detail-item">
                <span className="detail-label">Distance</span>
                <span className="detail-value">{workout.distance} km</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Intensity</span>
              <span className="detail-value">
                {workout.intensity.charAt(0).toUpperCase() +
                  workout.intensity.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {workout.notes && (
          <div className="detail-section">
            <h3>Notes</h3>
            <p className="workout-notes">{workout.notes}</p>
          </div>
        )}

        <div className="detail-section">
          <h3>Timestamps</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Created</span>
              <span className="detail-value">
                {new Date(workout.created_at).toLocaleString()}
              </span>
            </div>
            {workout.started_at && (
              <div className="detail-item">
                <span className="detail-label">Started</span>
                <span className="detail-value">
                  {new Date(workout.started_at).toLocaleString()}
                </span>
              </div>
            )}
            {workout.completed_at && (
              <div className="detail-item">
                <span className="detail-label">Completed</span>
                <span className="detail-value">
                  {new Date(workout.completed_at).toLocaleString()}
                </span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Last Updated</span>
              <span className="detail-value">
                {new Date(workout.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <Link to="/workouts" className="btn-secondary">
            Back to List
          </Link>
          
          {workout.status === 'planned' && (
            <button
              className="btn-action btn-start"
              onClick={() => handleStatusChange('start')}
            >
              Start Workout
            </button>
          )}
          
          {workout.status === 'in_progress' && (
            <button
              className="btn-action btn-complete"
              onClick={() => handleStatusChange('complete')}
            >
              Complete Workout
            </button>
          )}
          
          {workout.status !== 'completed' && workout.status !== 'skipped' && (
            <button
              className="btn-action btn-skip"
              onClick={() => handleStatusChange('skip')}
            >
              Skip Workout
            </button>
          )}
          
          <Link
            to={`/workouts/${workout.id}/edit`}
            className="btn-primary"
          >
            Edit Workout
          </Link>
          
          <button className="btn-danger" onClick={handleDelete}>
            Delete Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;

