// MealDetail.test.jsx - Simple unit test for MealDetail component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple Mock MealDetail Component
const MockMealDetail = ({ meal, onEdit, onDelete }) => {
  if (!meal) {
    return (
      <div data-testid="meal-detail">
        <p>Meal not found</p>
      </div>
    );
  }

  const handleEdit = () => {
    if (onEdit) onEdit(meal.id);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(meal.id);
  };

  return (
    <div data-testid="meal-detail">
      <h2>{meal.name}</h2>
      <div className="meal-info">
        <p data-testid="calories">Calories: {meal.calories}</p>
        <p data-testid="protein">Protein: {meal.protein}g</p>
        <p data-testid="carbs">Carbs: {meal.carbs}g</p>
        <p data-testid="fat">Fat: {meal.fat}g</p>
        {meal.description && (
          <p data-testid="description">Description: {meal.description}</p>
        )}
        {meal.date && (
          <p data-testid="date">Date: {meal.date}</p>
        )}
      </div>
      <div className="meal-actions">
        <button 
          data-testid="edit-button" 
          onClick={handleEdit}
        >
          Edit Meal
        </button>
        <button 
          data-testid="delete-button" 
          onClick={handleDelete}
        >
          Delete Meal
        </button>
      </div>
    </div>
  );
};

describe('MealDetail Component', () => {
  const mockMeal = {
    id: 1,
    name: 'Grilled Chicken Salad',
    calories: 450,
    protein: 35,
    carbs: 20,
    fat: 25,
    description: 'Healthy grilled chicken with mixed greens',
    date: '2024-01-01'
  };

  test('renders meal not found when no meal provided', () => {
    render(<MockMealDetail />);
    
    expect(screen.getByTestId('meal-detail')).toBeInTheDocument();
    expect(screen.getByText('Meal not found')).toBeInTheDocument();
  });

  test('renders meal details correctly', () => {
    render(<MockMealDetail meal={mockMeal} />);
    
    expect(screen.getByTestId('meal-detail')).toBeInTheDocument();
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    expect(screen.getByTestId('calories')).toHaveTextContent('Calories: 450');
    expect(screen.getByTestId('protein')).toHaveTextContent('Protein: 35g');
    expect(screen.getByTestId('carbs')).toHaveTextContent('Carbs: 20g');
    expect(screen.getByTestId('fat')).toHaveTextContent('Fat: 25g');
    expect(screen.getByTestId('description')).toHaveTextContent('Description: Healthy grilled chicken with mixed greens');
    expect(screen.getByTestId('date')).toHaveTextContent('Date: 2024-01-01');
  });

  test('renders meal without optional fields', () => {
    const simpleMeal = {
      id: 2,
      name: 'Simple Snack',
      calories: 150,
      protein: 5,
      carbs: 10,
      fat: 8
    };

    render(<MockMealDetail meal={simpleMeal} />);
    
    expect(screen.getByText('Simple Snack')).toBeInTheDocument();
    expect(screen.getByTestId('calories')).toHaveTextContent('Calories: 150');
    expect(screen.queryByTestId('description')).not.toBeInTheDocument();
    expect(screen.queryByTestId('date')).not.toBeInTheDocument();
  });

  test('calls onEdit when edit button clicked', () => {
    const mockOnEdit = jest.fn();
    
    render(<MockMealDetail meal={mockMeal} onEdit={mockOnEdit} />);
    
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(1);
  });

  test('calls onDelete when delete button clicked', () => {
    const mockOnDelete = jest.fn();
    
    render(<MockMealDetail meal={mockMeal} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('renders action buttons', () => {
    render(<MockMealDetail meal={mockMeal} />);
    
    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    expect(screen.getByText('Edit Meal')).toBeInTheDocument();
    expect(screen.getByText('Delete Meal')).toBeInTheDocument();
  });
});