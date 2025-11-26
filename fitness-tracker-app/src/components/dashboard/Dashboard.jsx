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
