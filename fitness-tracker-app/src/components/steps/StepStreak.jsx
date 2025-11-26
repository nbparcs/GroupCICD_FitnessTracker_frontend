import React from 'react';
import './Steps.css';

const StepStreak = ({ streak }) => {
  if (!streak) {
    return (
      <div className="streak-loading">
        <p>Loading streak...</p>
      </div>
    );
  }

  return (
    <div className="step-streak-container">
      <h3>🔥 Your Streak</h3>
      
      <div className="streak-display">
        <div className="streak-main">
          <div className="streak-flame">🔥</div>
          <div className="streak-number">{streak.current_streak}</div>
          <div className="streak-label">Day Streak</div>
        </div>

        <div className="streak-stats">
          <div className="streak-stat">
            <div className="streak-stat-icon">🏆</div>
            <div className="streak-stat-content">
              <div className="streak-stat-value">{streak.longest_streak}</div>
              <div className="streak-stat-label">Longest Streak</div>
            </div>
          </div>

          <div className="streak-stat">
            <div className="streak-stat-icon">✅</div>
            <div className="streak-stat-content">
              <div className="streak-stat-value">{streak.total_days_goal_met}</div>
              <div className="streak-stat-label">Goals Achieved</div>
            </div>
          </div>
        </div>
      </div>

      {streak.current_streak === 0 ? (
        <div className="streak-message warning">
          Start your streak today by reaching your step goal!
        </div>
      ) : streak.current_streak >= 7 ? (
        <div className="streak-message success">
          Amazing! You're on a {streak.current_streak}-day streak! 🎉
        </div>
      ) : (
        <div className="streak-message info">
          Keep it up! {7 - streak.current_streak} more days to reach a week!
        </div>
      )}
    </div>
  );
};

export default StepStreak;
