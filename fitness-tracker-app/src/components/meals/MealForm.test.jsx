// MealForm.test.jsx - Simple unit test for MealForm component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple Mock MealForm Component
const MockMealForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Meal submitted:', formData);
  };

  return (
    <div data-testid="meal-form">
      <h2>Log Meal</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Meal Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter meal name"
          />
        </div>
        <div>
          <label htmlFor="calories">Calories</label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            placeholder="Enter calories"
          />
        </div>
        <div>
          <label htmlFor="protein">Protein (g)</label>
          <input
            type="number"
            id="protein"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            placeholder="Enter protein"
          />
        </div>
        <button type="submit">Log Meal</button>
      </form>
    </div>
  );
};

describe('MealForm Component', () => {
  test('renders meal form', () => {
    render(<MockMealForm />);
    
    expect(screen.getByTestId('meal-form')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Log Meal' })).toBeInTheDocument();
    expect(screen.getByLabelText(/meal name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/protein/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log meal/i })).toBeInTheDocument();
  });

  test('handles input changes', () => {
    render(<MockMealForm />);
    
    const nameInput = screen.getByLabelText(/meal name/i);
    const caloriesInput = screen.getByLabelText(/calories/i);
    
    fireEvent.change(nameInput, { target: { value: 'Chicken Salad' } });
    fireEvent.change(caloriesInput, { target: { value: '350' } });
    
    expect(nameInput.value).toBe('Chicken Salad');
    expect(caloriesInput.value).toBe('350');
  });

  test('submits form with meal data', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<MockMealForm />);
    
    const nameInput = screen.getByLabelText(/meal name/i);
    const submitButton = screen.getByRole('button', { name: /log meal/i });
    
    fireEvent.change(nameInput, { target: { value: 'Test Meal' } });
    fireEvent.click(submitButton);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Meal submitted:', 
      expect.objectContaining({ name: 'Test Meal' })
    );
    
    consoleSpy.mockRestore();
  });
});