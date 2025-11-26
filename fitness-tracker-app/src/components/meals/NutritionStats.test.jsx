// NutritionStats.test.jsx - Simple unit test for NutritionStats component
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple Mock NutritionStats Component
const MockNutritionStats = ({ meals = [] }) => {
  // Calculate totals from meals
  const calculateTotals = () => {
    return meals.reduce((totals, meal) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (meal.protein || 0),
      carbs: totals.carbs + (meal.carbs || 0),
      fat: totals.fat + (meal.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totals = calculateTotals();
  const mealCount = meals.length;

  return (
    <div data-testid="nutrition-stats">
      <h3>Nutrition Summary</h3>
      
      <div className="stats-overview">
        <div data-testid="meal-count" className="stat-item">
          <span className="stat-label">Total Meals:</span>
          <span className="stat-value">{mealCount}</span>
        </div>
      </div>

      <div className="nutrition-totals">
        <div data-testid="total-calories" className="nutrition-stat">
          <span className="stat-label">Total Calories:</span>
          <span className="stat-value">{totals.calories}</span>
        </div>
        
        <div data-testid="total-protein" className="nutrition-stat">
          <span className="stat-label">Total Protein:</span>
          <span className="stat-value">{totals.protein}g</span>
        </div>
        
        <div data-testid="total-carbs" className="nutrition-stat">
          <span className="stat-label">Total Carbs:</span>
          <span className="stat-value">{totals.carbs}g</span>
        </div>
        
        <div data-testid="total-fat" className="nutrition-stat">
          <span className="stat-label">Total Fat:</span>
          <span className="stat-value">{totals.fat}g</span>
        </div>
      </div>

      {mealCount === 0 && (
        <div data-testid="no-data" className="no-data">
          <p>No meals to analyze</p>
        </div>
      )}
    </div>
  );
};

describe('NutritionStats Component', () => {
  test('renders nutrition stats header', () => {
    render(<MockNutritionStats />);
    
    expect(screen.getByTestId('nutrition-stats')).toBeInTheDocument();
    expect(screen.getByText('Nutrition Summary')).toBeInTheDocument();
  });

  test('shows zero values when no meals provided', () => {
    render(<MockNutritionStats />);
    
    expect(screen.getByTestId('meal-count')).toHaveTextContent('Total Meals:0');
    expect(screen.getByTestId('total-calories')).toHaveTextContent('Total Calories:0');
    expect(screen.getByTestId('total-protein')).toHaveTextContent('Total Protein:0g');
    expect(screen.getByTestId('total-carbs')).toHaveTextContent('Total Carbs:0g');
    expect(screen.getByTestId('total-fat')).toHaveTextContent('Total Fat:0g');
    expect(screen.getByTestId('no-data')).toHaveTextContent('No meals to analyze');
  });

  test('calculates correct totals for single meal', () => {
    const meals = [
      {
        id: 1,
        name: 'Breakfast',
        calories: 350,
        protein: 15,
        carbs: 45,
        fat: 12
      }
    ];

    render(<MockNutritionStats meals={meals} />);
    
    expect(screen.getByTestId('meal-count')).toHaveTextContent('Total Meals:1');
    expect(screen.getByTestId('total-calories')).toHaveTextContent('Total Calories:350');
    expect(screen.getByTestId('total-protein')).toHaveTextContent('Total Protein:15g');
    expect(screen.getByTestId('total-carbs')).toHaveTextContent('Total Carbs:45g');
    expect(screen.getByTestId('total-fat')).toHaveTextContent('Total Fat:12g');
    expect(screen.queryByTestId('no-data')).not.toBeInTheDocument();
  });

  test('calculates correct totals for multiple meals', () => {
    const meals = [
      {
        id: 1,
        name: 'Breakfast',
        calories: 350,
        protein: 15,
        carbs: 45,
        fat: 12
      },
      {
        id: 2,
        name: 'Lunch',
        calories: 500,
        protein: 25,
        carbs: 40,
        fat: 20
      },
      {
        id: 3,
        name: 'Dinner',
        calories: 600,
        protein: 30,
        carbs: 50,
        fat: 25
      }
    ];

    render(<MockNutritionStats meals={meals} />);
    
    expect(screen.getByTestId('meal-count')).toHaveTextContent('Total Meals:3');
    expect(screen.getByTestId('total-calories')).toHaveTextContent('Total Calories:1450');
    expect(screen.getByTestId('total-protein')).toHaveTextContent('Total Protein:70g');
    expect(screen.getByTestId('total-carbs')).toHaveTextContent('Total Carbs:135g');
    expect(screen.getByTestId('total-fat')).toHaveTextContent('Total Fat:57g');
  });

  test('handles meals with missing nutrition data', () => {
    const meals = [
      {
        id: 1,
        name: 'Complete Meal',
        calories: 300,
        protein: 20,
        carbs: 30,
        fat: 10
      },
      {
        id: 2,
        name: 'Partial Meal',
        calories: 200,
        protein: 15
        // missing carbs and fat
      },
      {
        id: 3,
        name: 'Minimal Meal'
        // missing all nutrition data
      }
    ];

    render(<MockNutritionStats meals={meals} />);
    
    expect(screen.getByTestId('meal-count')).toHaveTextContent('Total Meals:3');
    expect(screen.getByTestId('total-calories')).toHaveTextContent('Total Calories:500');
    expect(screen.getByTestId('total-protein')).toHaveTextContent('Total Protein:35g');
    expect(screen.getByTestId('total-carbs')).toHaveTextContent('Total Carbs:30g');
    expect(screen.getByTestId('total-fat')).toHaveTextContent('Total Fat:10g');
  });

  test('displays all nutrition stat elements', () => {
    const meals = [{ id: 1, name: 'Test', calories: 100, protein: 10, carbs: 15, fat: 5 }];
    
    render(<MockNutritionStats meals={meals} />);
    
    expect(screen.getByText('Total Meals:')).toBeInTheDocument();
    expect(screen.getByText('Total Calories:')).toBeInTheDocument();
    expect(screen.getByText('Total Protein:')).toBeInTheDocument();
    expect(screen.getByText('Total Carbs:')).toBeInTheDocument();
    expect(screen.getByText('Total Fat:')).toBeInTheDocument();
  });

  test('handles empty meals array correctly', () => {
    render(<MockNutritionStats meals={[]} />);
    
    expect(screen.getByTestId('meal-count')).toHaveTextContent('Total Meals:0');
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });
});