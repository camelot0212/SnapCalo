import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Onboarding } from '../features/onboarding/Onboarding';
import { useUser } from '../context/UserContext';
import { getUserProfile } from '../lib/storage';

export function OnboardingPage() {
    const navigate = useNavigate();
    const { updateUser } = useUser();

    const handleComplete = () => {
        // Since Onboarding component saves to localStorage internally (for now),
        // we need to sync Context.
        // Ideally we refactor Onboarding to return the profile, but for quick refactor:
        const profile = getUserProfile();
        if (profile) {
            updateUser(profile);
            navigate('/dashboard');
        }
    };

    return <Onboarding onComplete={handleComplete} />;
}
