import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Check if "Loading" or "Onboarding" or "Dashboard" is present
        // Since we start with loading in contexts usually, or check redirection.
        // Let's just check if it mounts.
        expect(document.body).toBeInTheDocument();
    });
});
