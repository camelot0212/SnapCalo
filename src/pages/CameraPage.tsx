import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraView } from '../features/camera/CameraView';
import { FoodItem } from '../types';

export function CameraPage() {
    const navigate = useNavigate();

    const handleAnalysisComplete = (items: Omit<FoodItem, 'id'>[], imageBase64: string) => {
        navigate('/editor', { state: { items, imageBase64 } });
    };

    return (
        <CameraView
            onClose={() => navigate('/dashboard')}
            onAnalysisComplete={handleAnalysisComplete}
        />
    );
}
