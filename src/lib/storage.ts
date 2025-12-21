import { Meal, UserProfile } from '../types';

const USER_KEY = 'snapcalo_user';
const MEALS_KEY = 'snapcalo_meals';

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveMeal = (meal: Meal): void => {
  const meals = getMeals();
  meals.push(meal);
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
};

export const getMeals = (): Meal[] => {
  const data = localStorage.getItem(MEALS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getMealsByDate = (date: Date): Meal[] => {
  const meals = getMeals();
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return meals.filter(m => m.timestamp >= startOfDay.getTime() && m.timestamp <= endOfDay.getTime());
};

export const calculateTDEE = (weight: number, height: number, age: number, gender: string, goal: string): number => {
  // Mifflin-St Jeor Equation
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender === 'Nam') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Activity Multiplier (Assuming Sedentary/Light Active for simplicity as per PRD)
  const activityMultiplier = 1.375; 
  let tdee = Math.round(bmr * activityMultiplier);

  // Goal Adjustment
  if (goal === 'Giảm cân') return tdee - 500;
  if (goal === 'Tăng cân') return tdee + 500;
  return tdee;
};
