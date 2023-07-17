import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../components/Pages/Register';

describe('Register Component', () => {
    it('renders without crashing', () => {
        render(<Register />);
    });

    it('displays a loading spinner initially', () => {
        render(<Register />);
        const loadingSpinner = screen.getByRole('alert');
        expect(loadingSpinner).toBeInTheDocument();
    });

    it('renders the registration form when not loading', async () => {
        render(<Register />);
        const loadingSpinner = screen.getByRole('alert');
        expect(loadingSpinner).toBeInTheDocument();

        // Wait for the loading spinner to disappear
        await waitFor(() => {
            expect(loadingSpinner).not.toBeInTheDocument();
        });

        // Check that the registration form is rendered
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('displays validation errors for invalid input', async () => {
        render(<Register />);
        const loadingSpinner = screen.getByRole('alert');
        expect(loadingSpinner).toBeInTheDocument();

        // Wait for the loading spinner to disappear
        await waitFor(() => {
            expect(loadingSpinner).not.toBeInTheDocument();
        });

        // Submit the form without filling in any fields
        fireEvent.submit(screen.getByRole('button', { name: 'Sign Up' }));

        // Check that validation errors are displayed
        expect(screen.getByText('Required')).toBeInTheDocument();
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    });

    it('submits the form with valid input', async () => {
        render(<Register />);
        const loadingSpinner = screen.getByRole('alert');
        expect(loadingSpinner).toBeInTheDocument();

        // Wait for the loading spinner to disappear
        await waitFor(() => {
            expect(loadingSpinner).not.toBeInTheDocument();
        });

        // Fill in valid input
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.submit(screen.getByRole('button', { name: 'Sign Up' }));

    });


});
