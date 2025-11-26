import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import stepService from '../../services/stepService';
import './Steps.css';

const StepDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStepDetail = useCallback(async () => {
    try {
      setLoading(true);
      const data = await stepService.getStepRecord(id);
      setStep(data);
    } catch (err) {
      setError('Failed to load step record');
      console.error('Error fetching step detail:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStepDetail();
  }, [fetchStepDetail]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this step record?')) {
      return;
    }

    try {
      await stepService.deleteStepRecord(id);
      navigate('/steps/history');
    } catch (err) {
      alert('Failed to delete step record');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading step details...</p>
      </div>
    );
  }

  if (error || !step) {
    return (
      <div className="error-container">
        <div className="error-message">{error || 'Step record not found'}</div>
        <Link to="/steps/history" className="btn-primary">
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="step-detail-container">
      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-title-section">
            <div className="detail-icon">👣</div>
            <div>
              <h1>{step.steps.toLocaleString()} Steps</h1>
              <div className="detail-meta">
                <span className="detail-date">
                  {new Date(step.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {step.goal_achieved && (
                  <span className="goal-badge success">✅ Goal Achieved</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Progress</h3>
          <div className="progress-detail">
            <div className="progress-bar-large">
              <div 
                className="progress-fill-large"
                style={{ 
                  width: `${Math.min(step.goal_percentage, 100)}%`,
                  backgroundColor: step.goal_achieved ? '#4caf50' : '#667eea'
                }}
              />
            </div>
            <div className="progress-info">
              <span className="progress-percentage">{step.goal_percentage}%</span>
              <span className="progress-text">of daily goal</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Activity Metrics</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-item-icon">👣</div>
              <div className="detail-item-content">
                <div className="detail-label">Steps</div>
                <div className="detail-value">{step.steps.toLocaleString()}</div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-item-icon">📏</div>
              <div className="detail-item-content">
                <div className="detail-label">Distance</div>
                <div className="detail-value">
                  {step.estimated_distance_km} km
                  <div className="detail-sublabel">
                    {(step.estimated_distance_km * 0.621371).toFixed(2)} miles
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-item-icon">🔥</div>
              <div className="detail-item-content">
                <div className="detail-label">Calories Burned</div>
                <div className="detail-value">{step.estimated_calories} kcal</div>
              </div>
            </div>

            {step.active_minutes && (
              <div className="detail-item">
                <div className="detail-item-icon">⏱️</div>
                <div className="detail-item-content">
                  <div className="detail-label">Active Time</div>
                  <div className="detail-value">
                    {step.active_minutes} min
                    <div className="detail-sublabel">
                      {Math.floor(step.active_minutes / 60)}h {step.active_minutes % 60}m
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="detail-item">
              <div className="detail-item-icon">📱</div>
              <div className="detail-item-content">
                <div className="detail-label">Source</div>
                <div className="detail-value">{step.source}</div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-item-icon">📅</div>
              <div className="detail-item-content">
                <div className="detail-label">Logged</div>
                <div className="detail-value">
                  {new Date(step.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {step.notes && (
          <div className="detail-section">
            <h3>Notes</h3>
            <div className="step-notes">
              <p>{step.notes}</p>
            </div>
          </div>
        )}

        <div className="detail-actions">
          <Link to="/steps/history" className="btn-secondary">
            Back to History
          </Link>
          <Link to={`/steps/${step.id}/edit`} className="btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepDetail;
