import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { MealEditor } from '../features/editor/MealEditor';
import { useMeals } from '../context/MealContext';
import { FoodItem, MealType } from '../types';

export function EditorPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addMeal } = useMeals();

    const state = location.state as { items: Omit<FoodItem, 'id'>[], imageBase64: string } | undefined;

    if (!state) {
        return <Navigate to="/dashboard" />;
    }

    const handleSave = (items: FoodItem[], type: MealType) => {
        addMeal(items, type, state.imageBase64);
        navigate('/dashboard');
    };

    return (
        <MealEditor
            initialItems={state.items}
            imageBase64={state.imageBase64}
            onSave={handleSave}
            onCancel={() => navigate('/camera')}
        />
    );
}
