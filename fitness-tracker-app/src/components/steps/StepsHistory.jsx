import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import stepService from '../../services/stepService';
import './Steps.css';

const StepsHistory = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [goalFilter, setGoalFilter] = useState('all');

  const fetchSteps = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};

      // Apply date filters
      const today = new Date();
      if (filterPeriod === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        params.start_date = weekAgo.toISOString().split('T')[0];
      } else if (filterPeriod === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        params.start_date = monthAgo.toISOString().split('T')[0];
      }

      // Apply goal filter
      if (goalFilter !== 'all') {
        params.goal_achieved = goalFilter === 'achieved';
      }

      const data = await stepService.getAllSteps(params);
      setSteps(data);
    } catch (err) {
      setError('Failed to load step history');
      console.error('Error fetching steps:', err);
    } finally {
      setLoading(false);
    }
  }, [filterPeriod, goalFilter]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this step record?')) {
      return;
    }

    try {
      await stepService.deleteStepRecord(id);
      setSteps(steps.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete step record');
    }
  };

  const filteredSteps = steps.filter(step =>
    step.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    step.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading step history...</p>
      </div>
    );
  }

  return (
    <div className="steps-history-container">
      <div className="history-header">
        <h1>Step History</h1>
        <div className="header-actions">
          <Link to="/steps" className="btn-secondary">
            Back to Dashboard
          </Link>
          <Link to="/steps/new" className="btn-primary">
            Log Steps
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="history-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notes or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Period:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterPeriod === 'all' ? 'active' : ''}`}
                onClick={() => setFilterPeriod('all')}
              >
                All Time
              </button>
              <button
                className={`filter-btn ${filterPeriod === 'week' ? 'active' : ''}`}
                onClick={() => setFilterPeriod('week')}
              >
                Last Week
              </button>
              <button
                className={`filter-btn ${filterPeriod === 'month' ? 'active' : ''}`}
                onClick={() => setFilterPeriod('month')}
              >
                Last Month
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label>Goal Status:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${goalFilter === 'all' ? 'active' : ''}`}
                onClick={() => setGoalFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${goalFilter === 'achieved' ? 'active' : ''}`}
                onClick={() => setGoalFilter('achieved')}
              >
                Goal Met
              </button>
              <button
                className={`filter-btn ${goalFilter === 'not_achieved' ? 'active' : ''}`}
                onClick={() => setGoalFilter('not_achieved')}
              >
                Goal Not Met
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredSteps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No step records found</h3>
          <p>Start tracking your steps today!</p>
          <Link to="/steps/new" className="btn-primary">
            Log Your First Steps
          </Link>
        </div>
      ) : (
        <div className="steps-list">
          {filteredSteps.map((step) => (
            <div key={step.id} className="step-record-card">
              <div className="record-header">
                <div className="record-date">
                  <div className="date-day">
                    {new Date(step.date).toLocaleDateString('en-US', { day: 'numeric' })}
                  </div>
                  <div className="date-month">
                    {new Date(step.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="date-year">
                    {new Date(step.date).getFullYear()}
                  </div>
                </div>

                <div className="record-main">
                  <div className="record-steps">
                    <span className="steps-value">{step.steps.toLocaleString()}</span>
                    <span className="steps-unit">steps</span>
                  </div>

                  {step.goal_achieved && (
                    <div className="goal-badge">
                      ✅ Goal Achieved
                    </div>
                  )}

                  <div className="record-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${Math.min(step.goal_percentage, 100)}%`,
                          backgroundColor: step.goal_achieved ? '#4caf50' : '#667eea'
                        }}
                      />
                    </div>
                    <div className="progress-label">{step.goal_percentage}% of goal</div>
                  </div>
                </div>
              </div>

              <div className="record-details">
                <div className="detail-item">
                  <span className="detail-icon">📏</span>
                  <span className="detail-value">{step.estimated_distance_km} km</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🔥</span>
                  <span className="detail-value">{step.estimated_calories} cal</span>
                </div>
                {step.active_minutes && (
                  <div className="detail-item">
                    <span className="detail-icon">⏱️</span>
                    <span className="detail-value">{step.active_minutes} min</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-icon">📱</span>
                  <span className="detail-value">{step.source}</span>
                </div>
              </div>

              {step.notes && (
                <div className="record-notes">
                  <strong>Notes:</strong> {step.notes}
                </div>
              )}

              <div className="record-actions">
                <Link to={`/steps/${step.id}`} className="btn-action btn-view">
                  View
                </Link>
                <Link to={`/steps/${step.id}/edit`} className="btn-action btn-edit">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(step.id)}
                  className="btn-action btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepsHistory;
