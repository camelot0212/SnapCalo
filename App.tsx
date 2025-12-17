import React, { useEffect, useState } from 'react';
import { UserProfile, Meal, AppScreen, FoodItem, MealType } from './types';
import { getUserProfile, getMealsByDate, saveMeal } from './services/storage';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { CameraView } from './components/CameraView';
import { MealEditor } from './components/MealEditor';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  
  // Temporary state for the flow: Camera -> Analysis -> Editor
  const [tempAnalysisItems, setTempAnalysisItems] = useState<Omit<FoodItem, 'id'>[]>([]);
  const [tempImage, setTempImage] = useState<string>('');

  useEffect(() => {
    // Check for user profile on load
    const profile = getUserProfile();
    if (profile) {
      setUser(profile);
      loadMeals();
    } else {
      setScreen('onboarding');
    }
  }, []);

  const loadMeals = () => {
    const meals = getMealsByDate(new Date());
    // Sort by time descending
    setTodaysMeals(meals.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleOnboardingComplete = () => {
    const profile = getUserProfile();
    setUser(profile);
    setScreen('dashboard');
  };

  const handleAnalysisComplete = (items: Omit<FoodItem, 'id'>[], imageBase64: string) => {
    setTempAnalysisItems(items);
    setTempImage(imageBase64);
    setScreen('editor');
  };

  const handleSaveMeal = (items: FoodItem[], type: MealType) => {
    const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
    
    const newMeal: Meal = {
      id: uuidv4(),
      timestamp: Date.now(),
      type,
      imageUrl: tempImage,
      items,
      totalCalories
    };

    saveMeal(newMeal);
    loadMeals(); // Refresh dashboard
    setScreen('dashboard');
    
    // Clear temp data
    setTempAnalysisItems([]);
    setTempImage('');
  };

  if (!user && screen !== 'onboarding') return null;

  return (
    <div className="antialiased text-gray-900 bg-white max-w-md mx-auto min-h-screen border-x border-gray-100 shadow-2xl relative">
      {screen === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {screen === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          meals={todaysMeals} 
          onOpenCamera={() => setScreen('camera')} 
        />
      )}

      {screen === 'camera' && (
        <CameraView 
          onClose={() => setScreen('dashboard')} 
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {screen === 'editor' && (
        <MealEditor 
          initialItems={tempAnalysisItems} 
          imageBase64={tempImage}
          onSave={handleSaveMeal}
          onCancel={() => setScreen('camera')}
        />
      )}
    </div>
  );
}
