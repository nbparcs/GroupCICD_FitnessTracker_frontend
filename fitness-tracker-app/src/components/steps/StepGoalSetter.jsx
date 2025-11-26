import React, { useState } from 'react';
import stepService from '../../services/stepService';
import './Steps.css';

const StepGoalSetter = ({ currentGoal, onGoalUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState(currentGoal?.daily_goal || 10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const presetGoals = [
    { value: 5000, label: '5,000', description: 'Light Activity' },
    { value: 7500, label: '7,500', description: 'Moderate' },
    { value: 10000, label: '10,000', description: 'Recommended' },
    { value: 12500, label: '12,500', description: 'Active' },
    { value: 15000, label: '15,000', description: 'Very Active' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (goal < 1000 || goal > 100000) {
      setError('Goal must be between 1,000 and 100,000 steps');
      return;
    }

    try {
      setLoading(true);
      await stepService.updateStepGoal(goal);
      setSuccess('Goal updated successfully!');
      setIsEditing(false);
      if (onGoalUpdated) {
        onGoalUpdated();
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update goal');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (value) => {
    setGoal(value);
  };

  return (
    <div className="step-goal-setter">
      <h3>🎯 Daily Goal</h3>

      {!isEditing ? (
        <div className="goal-display">
          <div className="goal-number">{(currentGoal?.daily_goal || 10000).toLocaleString()}</div>
          <div className="goal-label">steps per day</div>
          <button 
            className="btn-edit-goal" 
            onClick={() => setIsEditing(true)}
          >
            Edit Goal
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="goal-form">
          <div className="preset-goals">
            {presetGoals.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={`preset-btn ${goal === preset.value ? 'active' : ''}`}
                onClick={() => handlePresetClick(preset.value)}
              >
                <div className="preset-value">{preset.label}</div>
                <div className="preset-description">{preset.description}</div>
              </button>
            ))}
          </div>

          <div className="form-group">
            <label>Custom Goal</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(parseInt(e.target.value) || 0)}
              min="1000"
              max="100000"
              step="100"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setGoal(currentGoal?.daily_goal || 10000);
                setError('');
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Goal'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StepGoalSetter;
