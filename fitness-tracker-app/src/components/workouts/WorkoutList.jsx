import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import workoutService from '../../services/workoutService';
import WorkoutCard from './WorkoutCard';
import WorkoutStats from './WorkoutStats';
import './Workouts.css';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter === 'today') {
        const data = await workoutService.getTodayWorkouts();
        setWorkouts(data);
      } else if (filter === 'week') {
        const data = await workoutService.getWeekWorkouts();
        setWorkouts(data);
      } else if (filter !== 'all') {
        params.status = filter;
        const data = await workoutService.getAllWorkouts(params);
        setWorkouts(data);
      } else {
        const data = await workoutService.getAllWorkouts();
        setWorkouts(data);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to load workouts. Please try again.');
      console.error('Error fetching workouts:', err);
      setWorkouts([]); // Ensure workouts is always an array
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutService.deleteWorkout(id);
        setWorkouts((workouts || []).filter(workout => workout.id !== id));
      } catch (err) {
        setError('Failed to delete workout.');
        console.error('Error deleting workout:', err);
      }
    }
  };

  const handleStatusChange = async (id, action) => {
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
      
      // Update the workout in the list
      setWorkouts((workouts || []).map(w => w.id === id ? updatedWorkout : w));
    } catch (err) {
      setError(`Failed to ${action} workout.`);
      console.error(`Error ${action} workout:`, err);
    }
  };

  const filteredWorkouts = (workouts || []).filter(workout =>
    workout.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading workouts...</p>
      </div>
    );
  }

  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h1>My Workouts</h1>
        <Link to="/workouts/new" className="btn-primary">
          + Add Workout
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <WorkoutStats />

      <div className="workouts-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >
            Today
          </button>
          <button
            className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
            onClick={() => setFilter('week')}
          >
            This Week
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${filter === 'planned' ? 'active' : ''}`}
            onClick={() => setFilter('planned')}
          >
            Planned
          </button>
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏃</div>
          <h3>No workouts found</h3>
          <p>Start tracking your fitness journey by adding your first workout!</p>
          <Link to="/workouts/new" className="btn-primary">
            Add Your First Workout
          </Link>
        </div>
      ) : (
        <div className="workouts-grid">
          {filteredWorkouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;

