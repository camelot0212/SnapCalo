import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from '../features/dashboard/Dashboard';
import { useUser } from '../context/UserContext';
import { useMeals } from '../context/MealContext';

export function DashboardPage() {
    const { user, isLoading } = useUser();
    const { todaysMeals } = useMeals();
    const navigate = useNavigate();

    // ProtectedRoute handles auth check and loading
    return (
        <Dashboard
            user={user!}
            meals={todaysMeals}
            onOpenCamera={() => navigate('/camera')}
        />
    );


}
