// MealCard.test.jsx - Simple unit test for MealCard component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple Mock MealCard Component
const MockMealCard = ({ meal, onClick, onDelete, showActions = true }) => {
  if (!meal) {
    return <div data-testid="meal-card">No meal data</div>;
  }

  const handleCardClick = () => {
    if (onClick) onClick(meal.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(meal.id);
  };

  return (
    <div 
      data-testid={`meal-card-${meal.id}`}
      className="meal-card"
      onClick={handleCardClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="meal-header">
        <h3 data-testid="meal-name">{meal.name}</h3>
        {meal.date && (
          <span data-testid="meal-date" className="meal-date">
            {meal.date}
          </span>
        )}
      </div>
      
      <div className="meal-nutrition">
        <div data-testid="meal-calories" className="nutrition-item">
          <span className="label">Calories:</span>
          <span className="value">{meal.calories}</span>
        </div>
        <div data-testid="meal-protein" className="nutrition-item">
          <span className="label">Protein:</span>
          <span className="value">{meal.protein}g</span>
        </div>
        {meal.carbs && (
          <div data-testid="meal-carbs" className="nutrition-item">
            <span className="label">Carbs:</span>
            <span className="value">{meal.carbs}g</span>
          </div>
        )}
        {meal.fat && (
          <div data-testid="meal-fat" className="nutrition-item">
            <span className="label">Fat:</span>
            <span className="value">{meal.fat}g</span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="meal-actions">
          <button 
            data-testid="delete-button"
            onClick={handleDelete}
            className="delete-btn"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

describe('MealCard Component', () => {
  const mockMeal = {
    id: 1,
    name: 'Greek Yogurt Bowl',
    calories: 320,
    protein: 20,
    carbs: 25,
    fat: 12,
    date: '2024-01-01'
  };

  test('renders meal card with basic info', () => {
    render(<MockMealCard meal={mockMeal} />);
    
    expect(screen.getByTestId('meal-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('meal-name')).toHaveTextContent('Greek Yogurt Bowl');
    expect(screen.getByTestId('meal-calories')).toHaveTextContent('320');
    expect(screen.getByTestId('meal-protein')).toHaveTextContent('20g');
  });

  test('renders meal card without optional nutrition fields', () => {
    const simpleMeal = {
      id: 2,
      name: 'Simple Snack',
      calories: 150,
      protein: 5
    };

    render(<MockMealCard meal={simpleMeal} />);
    
    expect(screen.getByTestId('meal-name')).toHaveTextContent('Simple Snack');
    expect(screen.getByTestId('meal-calories')).toHaveTextContent('150');
    expect(screen.getByTestId('meal-protein')).toHaveTextContent('5g');
    expect(screen.queryByTestId('meal-carbs')).not.toBeInTheDocument();
    expect(screen.queryByTestId('meal-fat')).not.toBeInTheDocument();
  });

  test('renders date when provided', () => {
    render(<MockMealCard meal={mockMeal} />);
    
    expect(screen.getByTestId('meal-date')).toHaveTextContent('2024-01-01');
  });

  test('does not render date when not provided', () => {
    const mealWithoutDate = { ...mockMeal };
    delete mealWithoutDate.date;

    render(<MockMealCard meal={mealWithoutDate} />);
    
    expect(screen.queryByTestId('meal-date')).not.toBeInTheDocument();
  });

  test('calls onClick when card is clicked', () => {
    const mockOnClick = jest.fn();
    
    render(<MockMealCard meal={mockMeal} onClick={mockOnClick} />);
    
    const card = screen.getByTestId('meal-card-1');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledWith(1);
  });

  test('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    
    render(<MockMealCard meal={mockMeal} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('prevents card click when delete button is clicked', () => {
    const mockOnClick = jest.fn();
    const mockOnDelete = jest.fn();
    
    render(<MockMealCard meal={mockMeal} onClick={mockOnClick} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('hides actions when showActions is false', () => {
    render(<MockMealCard meal={mockMeal} showActions={false} />);
    
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });

  test('shows actions by default', () => {
    render(<MockMealCard meal={mockMeal} />);
    
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  test('renders "No meal data" when meal is not provided', () => {
    render(<MockMealCard />);
    
    expect(screen.getByText('No meal data')).toBeInTheDocument();
  });

  test('displays all nutrition information when provided', () => {
    render(<MockMealCard meal={mockMeal} />);
    
    expect(screen.getByTestId('meal-calories')).toHaveTextContent('Calories:320');
    expect(screen.getByTestId('meal-protein')).toHaveTextContent('Protein:20g');
    expect(screen.getByTestId('meal-carbs')).toHaveTextContent('Carbs:25g');
    expect(screen.getByTestId('meal-fat')).toHaveTextContent('Fat:12g');
  });
});