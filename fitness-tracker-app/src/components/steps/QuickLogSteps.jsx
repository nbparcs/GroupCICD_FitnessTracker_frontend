import React, { useState } from 'react';
import stepService from '../../services/stepService';
import './Steps.css';

const QuickLogSteps = ({ todaySteps, goal, onStepsLogged }) => {
  const [steps, setSteps] = useState(todaySteps?.steps || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dailyGoal = goal?.daily_goal || 10000;
  const currentSteps = todaySteps?.steps || 0;
  const percentage = Math.min((currentSteps / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - currentSteps, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!steps || parseInt(steps) < 0) {
      setError('Please enter a valid number of steps');
      return;
    }

    try {
      setLoading(true);
      await stepService.quickLogSteps(parseInt(steps));
      setSuccess('Steps logged successfully!');
      setSteps('');
      if (onStepsLogged) {
        onStepsLogged();
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error logging steps:', err);
      
      let errorMessage = 'Failed to log steps';
      
      if (err.response) {
        errorMessage = err.response.data?.error || 
                      err.response.data?.detail || 
                      `Server error (${err.response.status})`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check if the backend is running.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quick-log-steps">
      <h2>Today's Steps</h2>
      
      <div className="today-steps-display">
        <div className="steps-circle">
          <svg viewBox="0 0 100 100">
            <circle
              className="steps-circle-bg"
cx="50"
cy="50"
r="45"
/>
<circle
  className="steps-circle-progress"
  cx="50"
  cy="50"
  r="45"
  style={{
    strokeDasharray: `${percentage * 2.827}, 282.7`,
    stroke: percentage >= 100 ? '#4caf50' : '#667eea'
  }}
/>
</svg>
<div className="steps-circle-content">
<div className="steps-number">{currentSteps.toLocaleString()}</div>
<div className="steps-label">steps</div>
<div className="steps-percentage">{Math.round(percentage)}%</div>
</div>
</div>
    <div className="steps-info">
      <div className="info-item">
        <span className="info-icon">🎯</span>
        <div className="info-content">
          <div className="info-label">Daily Goal</div>
          <div className="info-value">{dailyGoal.toLocaleString()}</div>
        </div>
      </div>

      <div className="info-item">
        <span className="info-icon">📊</span>
        <div className="info-content">
          <div className="info-label">Remaining</div>
          <div className="info-value">{remaining.toLocaleString()}</div>
        </div>
      </div>

      {todaySteps && (
        <>
          <div className="info-item">
            <span className="info-icon">📏</span>
            <div className="info-content">
              <div className="info-label">Distance</div>
              <div className="info-value">{todaySteps.estimated_distance_km} km</div>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">🔥</span>
            <div className="info-content">
              <div className="info-label">Calories</div>
              <div className="info-value">{todaySteps.estimated_calories}</div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>

  <form onSubmit={handleSubmit} className="quick-log-form">
    <div className="form-group">
      <label>Log Steps</label>
      <div className="input-with-button">
        <input
          type="number"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="Enter step count"
          min="0"
          max="200000"
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Logging...' : 'Log'}
        </button>
      </div>
    </div>

    {error && <div className="error-message">{error}</div>}
    {success && <div className="success-message">{success}</div>}
  </form>

  {percentage >= 100 && (
    <div className="goal-achieved-banner">
      🎉 Goal Achieved! Great job!
    </div>
  )}
</div>
);
};

export default QuickLogSteps;
