import React, { useState, useEffect, useCallback } from 'react';
import workoutService from '../../services/workoutService';
import './Workouts.css';

const WorkoutStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date();
      let startDate;

      if (period === 'week') {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
      } else if (period === 'month') {
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
      } else if (period === 'year') {
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
      }

      const data = await workoutService.getWorkoutSummary(
        startDate ? startDate.toISOString().split('T')[0] : null,
        today.toISOString().split('T')[0]
      );
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
        <div className="stats-loading">Loading statistics...</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Workout Statistics</h2>
        <div className="period-selector">
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
          <button
            className={`period-btn ${period === 'year' ? 'active' : ''}`}
            onClick={() => setPeriod('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">🏃</div>
          <div className="stat-content">
            <div className="stat-label">Total Workouts</div>
            <div className="stat-number">{stats.total_workouts}</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Completed</div>
            <div className="stat-number">{stats.completed_workouts}</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-label">Total Time</div>
            <div className="stat-number">
              {Math.floor(stats.total_duration / 60)}h{' '}
              {stats.total_duration % 60}m
            </div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-label">Calories Burned</div>
            <div className="stat-number">
              {Math.round(stats.total_calories)}
            </div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <div className="stat-label">Distance</div>
            <div className="stat-number">
              {parseFloat(stats.total_distance).toFixed(1)} km
            </div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Completion Rate</div>
            <div className="stat-number">
              {stats.total_workouts > 0
                ? Math.round(
                    (stats.completed_workouts / stats.total_workouts) * 100
                  )
                : 0}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStats;
