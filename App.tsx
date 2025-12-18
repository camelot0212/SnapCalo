
import React, { useEffect, useState } from 'react';
import { UserProfile, Meal, AppScreen, FoodItem, MealType } from './types';
import { getUserProfile, getMealsByDate, saveMeal } from './services/storage';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { CameraView } from './components/CameraView';
import { MealEditor } from './components/MealEditor';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [screen, setScreen] = useState<AppScreen | 'loading'>('loading');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  
  const [tempAnalysisItems, setTempAnalysisItems] = useState<Omit<FoodItem, 'id'>[]>([]);
  const [tempImage, setTempImage] = useState<string>('');

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setUser(profile);
      loadMeals();
      setScreen('dashboard');
    } else {
      setScreen('onboarding');
    }
  }, []);

  const loadMeals = () => {
    const meals = getMealsByDate(new Date());
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
    loadMeals();
    setScreen('dashboard');
    setTempAnalysisItems([]);
    setTempImage('');
  };

  if (screen === 'loading') return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-emerald-100 font-bold tracking-widest text-xs uppercase">SnapCalo Loading</p>
    </div>
  );

  return (
    <div className="antialiased text-slate-900 bg-white max-w-md mx-auto min-h-screen border-x border-slate-100 shadow-2xl relative">
      {screen === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
      {screen === 'dashboard' && user && (
        <Dashboard user={user} meals={todaysMeals} onOpenCamera={() => setScreen('camera')} />
      )}
      {screen === 'camera' && (
        <CameraView onClose={() => setScreen('dashboard')} onAnalysisComplete={handleAnalysisComplete} />
      )}
      {screen === 'editor' && (
        <MealEditor initialItems={tempAnalysisItems} imageBase64={tempImage} onSave={handleSaveMeal} onCancel={() => setScreen('camera')} />
      )}
    </div>
  );
}
