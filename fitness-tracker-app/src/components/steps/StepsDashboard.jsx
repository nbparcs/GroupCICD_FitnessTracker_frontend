import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import stepService from '../../services/stepService';
import StepChart from './StepChart';
import QuickLogSteps from './QuickLogSteps';
import StepStats from './StepStats';
import StepStreak from './StepStreak';
import StepGoalSetter from './StepGoalSetter';
import './Steps.css';

const StepsDashboard = () => {
  const [todaySteps, setTodaySteps] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartPeriod, setChartPeriod] = useState(7);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [todayData, weekData, summaryData, streakData, goalData] = await Promise.all([
        stepService.getTodaySteps().catch(() => null),
        stepService.getWeeklySteps(),
        stepService.getStepSummary(30),
        stepService.getCurrentStreak(),
        stepService.getStepGoal(),
      ]);

      setTodaySteps(todayData);
      setWeeklyData(weekData);
      setSummary(summaryData);
      setStreak(streakData);
      setGoal(goalData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStepsLogged = () => {
    fetchDashboardData();
  };

  const handleGoalUpdated = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading steps dashboard...</p>
      </div>
    );
  }

  return (
    <div className="steps-dashboard-container">
      <div className="dashboard-header">
        <h1>🚶 Steps Tracker</h1>
        <div className="header-actions">
          <Link to="/steps/history" className="btn-secondary">
            View History
          </Link>
          <Link to="/steps/new" className="btn-primary">
            Log Steps
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        {/* Quick Log Section */}
        <div className="dashboard-card quick-log-card">
          <QuickLogSteps
            todaySteps={todaySteps}
            goal={goal}
            onStepsLogged={handleStepsLogged}
          />
        </div>

        {/* Streak Section */}
        <div className="dashboard-card streak-card">
          <StepStreak streak={streak} />
        </div>

        {/* Goal Setter */}
        <div className="dashboard-card goal-card">
          <StepGoalSetter
            currentGoal={goal}
            onGoalUpdated={handleGoalUpdated}
          />
        </div>

        {/* Weekly Progress Chart */}
        <div className="dashboard-card chart-card">
          <StepChart
            period={chartPeriod}
            onPeriodChange={setChartPeriod}
          />
        </div>

        {/* Statistics */}
        <div className="dashboard-card stats-card">
          <StepStats summary={summary} weeklyData={weeklyData} />
        </div>
      </div>
    </div>
  );
};

export default StepsDashboard;
