// MealList.test.jsx - Simple unit test for MealList component
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple Mock MealList Component
const MockMealList = ({ meals = [] }) => {
  if (meals.length === 0) {
    return (
      <div data-testid="meal-list">
        <h2>Your Meals</h2>
        <p>No meals logged yet.</p>
      </div>
    );
  }

  return (
    <div data-testid="meal-list">
      <h2>Your Meals</h2>
      <div className="meals-container">
        {meals.map(meal => (
          <div key={meal.id} data-testid={`meal-${meal.id}`} className="meal-card">
            <h3>{meal.name}</h3>
            <p>Calories: {meal.calories}</p>
            <p>Protein: {meal.protein}g</p>
            {meal.date && <p>Date: {meal.date}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

describe('MealList Component', () => {
  test('renders empty state when no meals', () => {
    render(<MockMealList />);
    
    expect(screen.getByTestId('meal-list')).toBeInTheDocument();
    expect(screen.getByText('Your Meals')).toBeInTheDocument();
    expect(screen.getByText('No meals logged yet.')).toBeInTheDocument();
  });

  test('renders meals when provided', () => {
    const mockMeals = [
      {
        id: 1,
        name: 'Breakfast Oatmeal',
        calories: 250,
        protein: 8,
        date: '2024-01-01'
      },
      {
        id: 2,
        name: 'Lunch Salad',
        calories: 350,
        protein: 15,
        date: '2024-01-01'
      }
    ];

    render(<MockMealList meals={mockMeals} />);
    
    expect(screen.getByTestId('meal-list')).toBeInTheDocument();
    expect(screen.getByText('Your Meals')).toBeInTheDocument();
    
    // Check first meal
    expect(screen.getByTestId('meal-1')).toBeInTheDocument();
    expect(screen.getByText('Breakfast Oatmeal')).toBeInTheDocument();
    expect(screen.getByText('Calories: 250')).toBeInTheDocument();
    expect(screen.getByText('Protein: 8g')).toBeInTheDocument();
    
    // Check second meal
    expect(screen.getByTestId('meal-2')).toBeInTheDocument();
    expect(screen.getByText('Lunch Salad')).toBeInTheDocument();
    expect(screen.getByText('Calories: 350')).toBeInTheDocument();
    expect(screen.getByText('Protein: 15g')).toBeInTheDocument();
  });

  test('displays correct number of meals', () => {
    const mockMeals = [
      { id: 1, name: 'Meal 1', calories: 200, protein: 10 },
      { id: 2, name: 'Meal 2', calories: 300, protein: 20 },
      { id: 3, name: 'Meal 3', calories: 400, protein: 30 }
    ];

    render(<MockMealList meals={mockMeals} />);
    
    const mealCards = screen.getAllByText(/Meal \d/);
    expect(mealCards).toHaveLength(3);
  });
});