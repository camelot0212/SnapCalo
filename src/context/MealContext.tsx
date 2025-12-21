import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Meal, FoodItem, MealType } from '../types';
import { getMealsByDate, saveMeal as saveMealToStorage } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface MealContextType {
    todaysMeals: Meal[];
    addMeal: (items: FoodItem[], type: MealType, imageBase64: string) => void;
    refreshMeals: () => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export function MealProvider({ children }: { children: ReactNode }) {
    const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);

    const refreshMeals = () => {
        const meals = getMealsByDate(new Date());
        setTodaysMeals(meals.sort((a, b) => b.timestamp - a.timestamp));
    };

    useEffect(() => {
        refreshMeals();
    }, []);

    const addMeal = (items: FoodItem[], type: MealType, imageBase64: string) => {
        const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
        const newMeal: Meal = {
            id: uuidv4(),
            timestamp: Date.now(),
            type,
            imageUrl: imageBase64,
            items,
            totalCalories
        };
        saveMealToStorage(newMeal);
        refreshMeals();
    };

    return (
        <MealContext.Provider value={{ todaysMeals, addMeal, refreshMeals }}>
            {children}
        </MealContext.Provider>
    );
}

export function useMeals() {
    const context = useContext(MealContext);
    if (context === undefined) {
        throw new Error('useMeals must be used within a MealProvider');
    }
    return context;
}
