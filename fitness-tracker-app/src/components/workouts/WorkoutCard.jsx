import React from 'react';
import { Link } from 'react-router-dom';
import './Workouts.css';

const WorkoutCard = ({ workout, onDelete, onStatusChange }) => {
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

  const getIntensityColor = (intensity) => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336',
    };
    return colors[intensity] || colors.medium;
  };

  const statusBadge = getStatusBadge(workout.status);

  return (
    <div className="workout-card">
      <div className="workout-card-header">
        <div className="workout-icon">{getWorkoutIcon(workout.workout_type)}</div>
        <div className="workout-header-info">
          <h3>{workout.title}</h3>
          <span className="workout-date">
            {new Date(workout.workout_date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <span className={`status-badge ${statusBadge.class}`}>
          {statusBadge.text}
        </span>
      </div>

      {workout.description && (
        <p className="workout-description">{workout.description}</p>
      )}

      <div className="workout-stats">
        {workout.duration && (
          <div className="stat-item">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">{workout.duration_display}</span>
          </div>
        )}
        {workout.calories_burned && (
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{workout.calories_burned} cal</span>
          </div>
        )}
        {workout.distance && (
          <div className="stat-item">
            <span className="stat-icon">📍</span>
            <span className="stat-value">{workout.distance} km</span>
          </div>
        )}
        <div className="stat-item">
          <span className="stat-icon">💪</span>
          <span
            className="stat-value"
            style={{ color: getIntensityColor(workout.intensity) }}
          >
            {workout.intensity}
          </span>
        </div>
      </div>

      <div className="workout-actions">
        {workout.status === 'planned' && (
          <button
            className="btn-action btn-start"
            onClick={() => onStatusChange(workout.id, 'start')}
          >
            Start
          </button>
        )}
        {workout.status === 'in_progress' && (
          <button
            className="btn-action btn-complete"
            onClick={() => onStatusChange(workout.id, 'complete')}
          >
            Complete
          </button>
        )}
        {workout.status !== 'completed' && workout.status !== 'skipped' && (
          <button
            className="btn-action btn-skip"
            onClick={() => onStatusChange(workout.id, 'skip')}
          >
            Skip
          </button>
        )}
        <Link to={`/workouts/${workout.id}`} className="btn-action btn-view">
          View
        </Link>
        <Link
          to={`/workouts/${workout.id}/edit`}
          className="btn-action btn-edit"
        >
          Edit
        </Link>
        <button
          className="btn-action btn-delete"
          onClick={() => onDelete(workout.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;
