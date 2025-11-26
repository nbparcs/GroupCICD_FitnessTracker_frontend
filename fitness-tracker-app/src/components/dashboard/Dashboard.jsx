import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import './Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your fitness data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Fitness Tracker Dashboard</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome back, {profile?.first_name}! 👋</h2>
          <p>Ready to track your fitness journey today?</p>
        </div>

        <div className="quick-actions">
  <h3>Quick Actions</h3>
  <div className="actions-grid">
    <Link to="/workouts" className="action-card">
      <div className="action-icon">🏃</div>
      <h4>View Workouts</h4>
      <p>See all your workout logs</p>
    </Link>
    <Link to="/workouts/new" className="action-card">
      <div className="action-icon">➕</div>
      <h4>Log Workout</h4>
      <p>Add a new workout entry</p>
    </Link>
    <Link to="/steps" className="action-card">
      <div className="action-icon">👣</div>
      <h4>View Steps</h4>
      <p>See all your step logs</p>
    </Link>
    <Link to="/steps/new" className="action-card">
      <div className="action-icon">➕</div>
      <h4>Log Steps</h4>
      <p>Add a new step entry</p>
    </Link>
  </div>
</div>

        <div className="profile-section">
          <h3>Your Profile</h3>
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">
                {profile?.first_name} {profile?.last_name}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{profile?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Username:</span>
              <span className="value">{profile?.username}</span>
            </div>
            <div className="info-item">
              <span className="label">Member Since:</span>
              <span className="value">
                {new Date(profile?.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="quick-stats">
          <h3>Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏃</div>
              <div className="stat-info">
                <p className="stat-label">Activities</p>
                <p className="stat-value">0</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👟</div>
              <div className="stat-info">
                <p className="stat-label">Steps Today</p>
                <p className="stat-value">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <p>
            📊 Activity tracking, meal logging, and analytics features coming
            soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
