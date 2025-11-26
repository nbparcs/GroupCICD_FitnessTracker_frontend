import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import stepService from '../../services/stepService';
import './Steps.css';

const StepForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    steps: '',
    distance_km: '',
    calories_burned: '',
    active_minutes: '',
    source: 'manual',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingData, setFetchingData] = useState(false);

  const fetchStepRecord = useCallback(async () => {
    try {
      setFetchingData(true);
      const data = await stepService.getStepRecord(id);
      setFormData({
        date: data.date,
        steps: data.steps,
        distance_km: data.distance_km || '',
        calories_burned: data.calories_burned || '',
        active_minutes: data.active_minutes || '',
        source: data.source,
        notes: data.notes || ''
      });
    } catch (err) {
      setError('Failed to load step record');
      console.error('Error fetching step record:', err);
    } finally {
      setFetchingData(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      fetchStepRecord();
    }
  }, [isEditMode, fetchStepRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate distance and calories if steps change
    if (name === 'steps' && value) {
      const steps = parseInt(value);
      if (!formData.distance_km) {
        setFormData(prev => ({
          ...prev,
          distance_km: (steps / 1250).toFixed(2)
        }));
      }
      if (!formData.calories_burned) {
        setFormData(prev => ({
          ...prev,
          calories_burned: Math.round(steps * 0.05)
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.steps || parseInt(formData.steps) < 0) {
      setError('Please enter a valid number of steps');
      return;
    }

    if (parseInt(formData.steps) > 200000) {
      setError('Steps seem unrealistic (max: 200,000)');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        date: formData.date,
        steps: parseInt(formData.steps),
        distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
        calories_burned: formData.calories_burned ? parseInt(formData.calories_burned) : null,
        active_minutes: formData.active_minutes ? parseInt(formData.active_minutes) : null,
        source: formData.source,
        notes: formData.notes
      };

      if (isEditMode) {
        await stepService.updateStepRecord(id, submitData);
      } else {
        await stepService.createStepRecord(submitData);
      }

      navigate('/steps/history');
    } catch (err) {
      console.error('Error creating/updating step record:', err);
      
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} step record`;
      
      if (err.response) {
        // Server responded with error status
        if (err.response.data) {
          errorMessage = 
            err.response.data.date?.[0] ||
            err.response.data.steps?.[0] ||
            err.response.data.error ||
            err.response.data.detail ||
            JSON.stringify(err.response.data);
        }
        errorMessage += ` (Status: ${err.response.status})`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check if the backend is running.';
      } else {
        // Something else happened
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading step record...</p>
      </div>
    );
  }

  return (
    <div className="step-form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>{isEditMode ? 'Edit Step Record' : 'Log Steps'}</h2>
          <Link to="/steps/history" className="btn-secondary-small">
            Back to History
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="step-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="manual">Manual Entry</option>
                  <option value="fitbit">Fitbit</option>
                  <option value="apple_health">Apple Health</option>
                  <option value="google_fit">Google Fit</option>
                  <option value="samsung_health">Samsung Health</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Step Data</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Steps *</label>
                <input
                  type="number"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  placeholder="e.g., 10000"
                  min="0"
                  max="200000"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Distance (km)</label>
                <input
                  type="number"
                  name="distance_km"
                  value={formData.distance_km}
                  onChange={handleChange}
                  placeholder="Auto-calculated"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Calories Burned</label>
                <input
                  type="number"
                  name="calories_burned"
                  value={formData.calories_burned}
                  onChange={handleChange}
                  placeholder="Auto-calculated"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Active Minutes</label>
                <input
                  type="number"
                  name="active_minutes"
                  value={formData.active_minutes}
                  onChange={handleChange}
                  placeholder="Optional"
                  min="0"
                  max="1440"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-note">
              <strong>Note:</strong> Distance and calories will be automatically calculated based on your steps if not provided.
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Notes</h3>
            
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes about your activity..."
                rows="4"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/steps/history')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update Steps' : 'Log Steps'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepForm;
