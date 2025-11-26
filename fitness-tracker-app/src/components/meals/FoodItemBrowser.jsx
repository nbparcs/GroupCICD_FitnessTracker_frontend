import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import mealService from '../../services/mealService';
import './Meals.css';

const FoodItemBrowser = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsData, categoriesData] = await Promise.all([
        mealService.getAllFoodItems(),
        mealService.getFoodCategories()
      ]);
      setFoodItems(itemsData);
      setCategories(categoriesData.categories || []);
    } catch (err) {
      setError('Failed to load food items.');
      console.error('Error fetching food items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseFood = (foodItem) => {
    // Navigate to meal form with pre-filled data
    navigate('/meals/new', {
      state: {
        prefillData: {
          name: foodItem.name,
          description: foodItem.description || '',
          calories: foodItem.calories,
          protein: foodItem.protein,
          carbohydrates: foodItem.carbohydrates,
          fats: foodItem.fats,
          fiber: foodItem.fiber,
          sugar: foodItem.sugar,
          sodium: foodItem.sodium,
          serving_size: foodItem.serving_size,
        }
      }
    });
  };

  const filteredFoodItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading food database...</p>
      </div>
    );
  }

  return (
    <div className="food-browser-container">
      <div className="food-browser-header">
        <h1>Food Database</h1>
        <Link to="/meals" className="btn-secondary">
          Back to Meals
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="food-browser-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          <button
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredFoodItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No food items found</h3>
          <p>Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="food-items-grid">
          {filteredFoodItems.map(item => (
            <div key={item.id} className="food-item-card">
              <div className="food-item-header">
                <h3>{item.name}</h3>
                {item.category && (
                  <span className="food-category-badge">{item.category}</span>
                )}
              </div>

              {item.description && (
                <p className="food-item-description">{item.description}</p>
              )}

              <div className="food-item-nutrition">
                <div className="nutrition-highlight">
                  <span className="nutrition-value">{Math.round(item.calories)}</span>
                  <span className="nutrition-label">calories</span>
                </div>

                <div className="nutrition-details">
                  {item.protein !== null && (
                    <div className="nutrition-item">
                      <span className="nutrition-icon">💪</span>
                      <span>{parseFloat(item.protein).toFixed(1)}g protein</span>
                    </div>
                  )}
                  {item.carbohydrates !== null && (
                    <div className="nutrition-item">
                      <span className="nutrition-icon">🌾</span>
                      <span>{parseFloat(item.carbohydrates).toFixed(1)}g carbs</span>
                    </div>
                  )}
                  {item.fats !== null && (
                    <div className="nutrition-item">
                      <span className="nutrition-icon">🥑</span>
                      <span>{parseFloat(item.fats).toFixed(1)}g fats</span>
                    </div>
                  )}
                </div>

                <div className="serving-info">
                  Per serving: {item.serving_size}
                </div>
              </div>

              <button
                className="btn-use-food"
                onClick={() => handleUseFood(item)}
              >
                Use This Food
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodItemBrowser;
