import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from '../features/dashboard/Dashboard';
import { useUser } from '../context/UserContext';
import { useMeals } from '../context/MealContext';

export function DashboardPage() {
    const { user, isLoading } = useUser();
    const { todaysMeals } = useMeals();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-emerald-100 font-bold tracking-widest text-xs uppercase">SnapCalo Loading</p>
            </div>
        );
    }

    // Redirect if no user (should be handled by protected route, but safe guard here)
    if (!user) {
        // We'll let App.tsx handle redirect or do it here
        return null;
    }

    return (
        <Dashboard
            user={user}
            meals={todaysMeals}
            onOpenCamera={() => navigate('/camera')}
        />
    );
}
