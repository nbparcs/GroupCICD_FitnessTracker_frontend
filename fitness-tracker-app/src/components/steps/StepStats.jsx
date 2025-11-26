import React from 'react';
import './Steps.css';

const StepStats = ({ summary, weeklyData }) => {
  if (!summary) {
    return (
      <div className="stats-loading">
        <p>Loading statistics...</p>
      </div>
    );
  }

  const stats = [
    {
      icon: '👣',
      label: 'Total Steps',
      value: summary.total_steps.toLocaleString(),
      sublabel: 'Last 30 days',
      color: '#667eea'
    },
    {
      icon: '📏',
      label: 'Total Distance',
      value: `${summary.total_distance_km.toFixed(1)} km`,
      sublabel: `${(summary.total_distance_km * 0.621371).toFixed(1)} miles`,
      color: '#4caf50'
    },
    {
      icon: '🔥',
      label: 'Calories Burned',
      value: summary.total_calories.toLocaleString(),
      sublabel: 'kcal',
      color: '#ff9800'
    },
    {
      icon: '⏱️',
      label: 'Active Time',
      value: summary.total_active_minutes || 0,
      sublabel: 'minutes',
      color: '#9c27b0'
    },
    {
      icon: '📊',
      label: 'Daily Average',
      value: summary.average_steps.toLocaleString(),
      sublabel: 'steps/day',
      color: '#2196f3'
    },
    {
      icon: '🎯',
      label: 'Goal Achievement',
      value: `${summary.goal_achievement_rate}%`,
      sublabel: `${summary.days_goal_met}/${summary.days_recorded} days`,
      color: '#f44336'
    },
    {
      icon: '🏆',
      label: 'Best Day',
      value: summary.highest_steps.toLocaleString(),
      sublabel: summary.highest_steps_date 
        ? new Date(summary.highest_steps_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })
        : 'N/A',
      color: '#ffc107'
    },
    {
      icon: '📅',
      label: 'Days Recorded',
      value: summary.days_recorded,
      sublabel: 'in last 30 days',
      color: '#00bcd4'
    }
  ];

  return (
    <div className="step-stats-container">
      <h3>Statistics (Last 30 Days)</h3>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="stat-sublabel">{stat.sublabel}</div>
            </div>
          </div>
        ))}
      </div>

      {weeklyData && weeklyData.length > 0 && (
        <div className="weekly-overview">
          <h4>This Week</h4>
          <div className="weekly-days">
            {weeklyData.map((day, index) => (
              <div 
                key={index} 
                className={`weekly-day ${day.goal_achieved ? 'goal-met' : ''}`}
              >
                <div className="day-name">{day.day_name.substring(0, 3)}</div>
                <div className="day-steps">{day.steps.toLocaleString()}</div>
                {day.goal_achieved && <div className="day-badge">✓</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepStats;
