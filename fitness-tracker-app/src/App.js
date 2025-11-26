import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import WorkoutList from './components/workouts/WorkoutList';
import WorkoutForm from './components/workouts/WorkoutForm';
import WorkoutDetail from './components/workouts/WorkoutDetail';
import PrivateRoute from './components/auth/PrivateRoute';
import MealList from './components/meals/MealList';
import MealForm from './components/meals/MealForm';
import MealDetail from './components/meals/MealDetail';
import FoodItemBrowser from './components/meals/FoodItemBrowser';
import StepsDashboard from './components/steps/StepsDashboard';
import StepsHistory from './components/steps/StepsHistory';
import StepForm from './components/steps/StepForm';
import StepDetail from './components/steps/StepDetail';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
             <Route
              path="/workouts"
              element={
                <PrivateRoute>
                  <WorkoutList />
                </PrivateRoute>
              }
            />
            <Route
              path="/workouts/new"
              element={
                <PrivateRoute>
                  <WorkoutForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/workouts/:id"
              element={
                <PrivateRoute>
                  <WorkoutDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/workouts/:id/edit"
              element={
                <PrivateRoute>
                  <WorkoutForm />
                </PrivateRoute>
              }
            />
            <Route path="/meals" element={
              <PrivateRoute>
                <MealList />
              </PrivateRoute>
            } />
            <Route path="/meals/new" element={
              <PrivateRoute>
                <MealForm />
              </PrivateRoute>
            } />
            <Route path="/meals/food-items" element={
              <PrivateRoute>
                <FoodItemBrowser />
              </PrivateRoute>
            } />
            <Route path="/meals/:id" element={
              <PrivateRoute>
                <MealDetail />
              </PrivateRoute>
            } />
            <Route path="/meals/:id/edit" element={
              <PrivateRoute>
                <MealForm />
              </PrivateRoute>
            } />
            <Route path="/steps" element={<PrivateRoute><StepsDashboard /></PrivateRoute>} />
            <Route path="/steps/history" element={<PrivateRoute><StepsHistory /></PrivateRoute>} />
            <Route path="/steps/new" element={<PrivateRoute><StepForm /></PrivateRoute>} />
            <Route path="/steps/:id" element={<PrivateRoute><StepDetail /></PrivateRoute>} />
            <Route path="/steps/:id/edit" element={<PrivateRoute><StepForm /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
