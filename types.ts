export enum Gender {
  Male = 'Nam',
  Female = 'Nữ'
}

export enum Goal {
  LoseWeight = 'Giảm cân',
  Maintain = 'Giữ cân',
  GainWeight = 'Tăng cân'
}

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  goal: Goal;
  tdee: number; // Daily calorie target
}

export interface FoodItem {
  id: string;
  name: string;
  weight: number; // grams
  calories: number; // kcal
  protein: number; // grams
  fat: number; // grams
  carbs: number; // grams
}

export enum MealType {
  Breakfast = 'Bữa sáng',
  Lunch = 'Bữa trưa',
  Dinner = 'Bữa tối',
  Snack = 'Ăn vặt'
}

export interface Meal {
  id: string;
  timestamp: number;
  type: MealType;
  imageUrl?: string;
  items: FoodItem[];
  totalCalories: number;
}

export type AppScreen = 'onboarding' | 'dashboard' | 'camera' | 'editor';

export interface AnalysisResult {
  foodItems: FoodItem[];
  imageBase64: string;
}
