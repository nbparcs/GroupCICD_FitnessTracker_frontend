import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import stepService from '../../services/stepService';
import './Steps.css';

const StepChart = ({ period = 7, onPeriodChange }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');

  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await stepService.getChartData(period);
      setChartData(data);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (period <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (period <= 31) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{new Date(label).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}</p>
          <p className="tooltip-steps">
            Steps: <strong>{data.steps.toLocaleString()}</strong>
          </p>
          <p className="tooltip-goal">
            Goal: {data.goal.toLocaleString()}
          </p>
          {data.goal_achieved && (
            <p className="tooltip-achieved">✅ Goal Achieved!</p>
          )}
          <p className="tooltip-distance">
            Distance: {data.distance_km.toFixed(2)} km
          </p>
          <p className="tooltip-calories">
            Calories: {data.calories}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="spinner"></div>
        <p>Loading chart...</p>
      </div>
    );
  }

  if (!chartData || !chartData.data) {
    return <div className="chart-error">No data available</div>;
  }

  const formattedData = chartData.data.map(item => ({
    ...item,
    dateLabel: formatDate(item.date)
  }));

  return (
    <div className="step-chart-container">
      <div className="chart-header">
        <h3>Step Progress</h3>
        
        <div className="chart-controls">
          <div className="period-selector">
            <button
              className={`period-btn ${period === 7 ? 'active' : ''}`}
              onClick={() => onPeriodChange(7)}
            >
              7 Days
            </button>
            <button
              className={`period-btn ${period === 14 ? 'active' : ''}`}
              onClick={() => onPeriodChange(14)}
            >
              14 Days
            </button>
            <button
              className={`period-btn ${period === 30 ? 'active' : ''}`}
              onClick={() => onPeriodChange(30)}
            >
              30 Days
            </button>
          </div>

          <div className="chart-type-selector">
            <button
              className={`type-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
              title="Bar Chart"
            >
              📊
            </button>
            <button
              className={`type-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
              title="Line Chart"
            >
              📈
            </button>
          </div>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'bar' ? (
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dateLabel" 
                tick={{ fontSize: 12 }}
                stroke="#888"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#888"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine 
                y={chartData.goal} 
                stroke="#ff9800" 
                strokeDasharray="3 3"
                label={{ value: 'Goal', position: 'right', fill: '#ff9800' }}
              />
              <Bar 
                dataKey="steps" 
                fill="#667eea"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dateLabel" 
                tick={{ fontSize: 12 }}
                stroke="#888"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#888"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine 
                y={chartData.goal} 
                stroke="#ff9800" 
                strokeDasharray="3 3"
                label={{ value: 'Goal', position: 'right', fill: '#ff9800' }}
              />
              <Line 
                type="monotone" 
                dataKey="steps" 
                stroke="#667eea"
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Period</span>
          <span className="summary-value">{period} days</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Daily Goal</span>
          <span className="summary-value">{chartData.goal.toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Days Tracked</span>
          <span className="summary-value">
            {chartData.data.filter(d => d.steps > 0).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepChart;
