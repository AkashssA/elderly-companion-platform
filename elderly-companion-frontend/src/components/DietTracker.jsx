import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { recipes } from '../data/recipes';
import { foodCatalog } from '../data/foodCatalog';
import './DietTracker.css';

const DietTracker = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState({});
  const [weeklyMeals, setWeeklyMeals] = useState({});
  
  const [calorieGoal, setCalorieGoal] = useState(1800);
  const [totalCalories, setTotalCalories] = useState(0);
  const [suggestion, setSuggestion] = useState('');
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'daily') fetchMealsForDate(date);
    if (activeTab === 'summary') fetchWeeklyMeals();
  }, [activeTab, date]);

  // This hook re-calculates calories whenever the 'meals' object changes
  useEffect(() => {
    calculateTotalCalories(meals);
  }, [meals]);

  const fetchMealsForDate = async (currentDate) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/meals/by-date/${currentDate}`);
      const mealsByDate = res.data.reduce((acc, meal) => {
        acc[meal.mealType] = meal.description;
        return acc;
      }, {});
      setMeals(mealsByDate);
    } catch(err) { console.error("Failed to fetch meals for date", err); }
  };

  const fetchWeeklyMeals = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/meals/weekly`);
      const groupedByDate = res.data.reduce((acc, meal) => {
        (acc[meal.date] = acc[meal.date] || []).push(meal);
        return acc;
      }, {});
      setWeeklyMeals(groupedByDate);
    } catch(err) { console.error("Failed to fetch weekly meals", err); }
  };

  // --- THIS IS THE CORRECTED CALORIE FUNCTION ---
  const calculateTotalCalories = (meals) => {
    let total = 0;
    // Join all meal descriptions (e.g., "Roti (x2), Dal (x1), Roti (x1)")
    const loggedMeals = Object.values(meals).join(', '); 
    
    for (const category of Object.values(foodCatalog)) {
      for (const item of category) {
        // Create a regex to find all "Item Name (xNUMBER)"
        // We must escape special characters in the item name, like ( or )
        const escapedName = item.name.replace(/([()])/g, '\\$1');
        const regex = new RegExp(`${escapedName} \\(x(\\d+)\\)`, 'g');
        
        let match;
        // This 'while' loop finds EVERY match, not just the first one
        while ((match = regex.exec(loggedMeals)) !== null) {
          // match[1] is the quantity (the \d+)
          const quantity = parseInt(match[1]);
          total += item.calories * quantity;
        }
      }
    }
    setTotalCalories(total);
  };
  // --- END OF CORRECTION ---

  const [isLogging, setIsLogging] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});

  const handleStartLogging = (mealType) => {
    setIsLogging(mealType);
    setSelectedItems({});
  };

  const handleItemSelect = (item) => {
    const newSelectedItems = { ...selectedItems };
    if (newSelectedItems[item.id]) {
      newSelectedItems[item.id].quantity += 1;
    } else {
      newSelectedItems[item.id] = { ...item, quantity: 1 };
    }
    setSelectedItems(newSelectedItems);
  };

  const handleSaveMeal = async () => {
    const description = Object.values(selectedItems)
      .map(item => `${item.name} (x${item.quantity})`)
      .join(', ');
    if (!description) { alert("Please select at least one item."); return; }

    await axios.post('http://localhost:5000/api/meals', { date, mealType: isLogging, description });
    fetchMealsForDate(date); // This will re-fetch and re-calculate calories
    setIsLogging(null);
  };

  const handleGetSuggestion = async (mealType) => {
    setIsSuggestionLoading(true);
    setSuggestion('');
    const remainingCalories = calorieGoal - totalCalories;
    
    if (remainingCalories <= 0) {
      setSuggestion("You have already met your calorie goal for the day. Well done!");
      setIsSuggestionLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/ai/suggest-meal', { 
        mealType, 
        remainingCalories 
      });
      setSuggestion(res.data.suggestion);
    } catch (err) {
      setSuggestion("Sorry, I couldn't get a suggestion right now.");
    }
    setIsSuggestionLoading(false);
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm("Are you sure you want to delete this meal entry?")) {
      try {
        await axios.delete(`http://localhost:5000/api/meals/${mealId}`);
        // Refresh both lists to keep them in sync
        fetchWeeklyMeals(); // This will update the summary
        fetchMealsForDate(date); // This will update the daily log & calorie count
      } catch (err) {
        console.error("Failed to delete meal", err);
        alert("Could not delete meal. Please try again.");
      }
    }
  };

  if (isLogging) {
    // This is the Meal Logging UI
    return (
      <div className="meal-logger-view">
        <h3>Logging {isLogging} for {new Date(date).toLocaleDateString("en-IN")}</h3>
        <div className="selected-items-bar">
          <strong>Selected:</strong> 
          {Object.keys(selectedItems).length === 0 ? " None" : 
            Object.values(selectedItems).map(item => (
              <span key={item.id} className="selected-item-tag">{item.name} x{item.quantity}</span>
            ))
          }
        </div>
        <div className="food-catalog">
          {Object.keys(foodCatalog).map(category => (
            <div key={category} className="catalog-category">
              <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <div className="items-grid">
                {foodCatalog[category].map(item => (
                  <button key={item.id} className="food-item-btn" onClick={() => handleItemSelect(item)}>
                    {item.name} ({item.calories} cal)
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="logger-actions">
            <button onClick={handleSaveMeal} className="save-meal-btn">Save Meal</button>
            <button onClick={() => setIsLogging(null)} className="cancel-btn">Cancel</button>
        </div>
      </div>
    );
  }

  // This is the main Diet Tracker page UI
  return (
    <div className="diet-container">
      <h2>Diet & Nutrition Tracker</h2>
      <div className="diet-tabs">
        <button onClick={() => setActiveTab('daily')} className={activeTab === 'daily' ? 'active' : ''}>Daily Log</button>
        <button onClick={() => setActiveTab('recipes')} className={activeTab === 'recipes' ? 'active' : ''}>Recipe Ideas</button>
        <button onClick={() => setActiveTab('summary')} className={activeTab === 'summary' ? 'active' : ''}>Weekly Summary</button>
      </div>

      {activeTab === 'daily' && (
        <>
          <div className="calorie-tracker">
            <h3>Daily Calorie Goal</h3>
            <div className="goal-setter">
              <label>Set your goal:</label>
              <input 
                type="number" 
                value={calorieGoal} 
                onChange={(e) => setCalorieGoal(e.target.value)} 
                step="50"
              />
              <span>calories</span>
            </div>
            <div className="calorie-progress-bar">
              <div 
                className="calorie-progress-fill" 
                style={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }}
              ></div>
            </div>
            <p>{totalCalories} / {calorieGoal} calories eaten</p>
          </div>
          
          <div className="daily-log">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            {['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => (
              <div key={mealType} className="meal-card">
                <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                <p>{meals[mealType] || 'No meal logged yet.'}</p>
                <button onClick={() => handleStartLogging(mealType)}>
                  {meals[mealType] ? 'Edit Meal' : 'Log Meal'}
                </button>
                {!meals[mealType] && (
                  <button onClick={() => handleGetSuggestion(mealType)} className="suggestion-btn">
                    Suggest {mealType}
                  </button>
                )}
              </div>
            ))}
          </div>
          {isSuggestionLoading && <p>Thinking of a healthy meal...</p>}
          {suggestion && (
            <div className="suggestion-container">
              <h4>Here's a healthy idea:</h4>
              <pre>{suggestion}</pre>
            </div>
          )}
        </>
      )}

      {activeTab === 'recipes' && (
        <div className="recipe-list">
          {recipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <h3>{recipe.title}</h3>
              <strong>Ingredients:</strong><ul>{recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
              <strong>Instructions:</strong><ol>{recipe.instructions.map((inst, i) => <li key={i}>{inst}</li>)}</ol>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'summary' && (
        <div className="weekly-summary">
            {Object.keys(weeklyMeals).length === 0 ? <p>No meals logged in the past week or for the week ahead.</p> :
             Object.keys(weeklyMeals).sort().reverse().map(day => (
                <div key={day} className="summary-day">
                    <h4>{new Date(day).toLocaleDateString("en-IN", { weekday: 'long', day: 'numeric', month: 'short' })}</h4>
                    <ul>
                        {weeklyMeals[day].map(meal => (
                           <li key={meal._id} className="summary-meal-item">
                            <span>
                              <strong>{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}:</strong> {meal.description}
                            </span>
                            <button onClick={() => handleDeleteMeal(meal._id)} className="meal-delete-btn">
                              Delete
                            </button>
                           </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DietTracker;