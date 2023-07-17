import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Main from '../components/MainPage/Main';

describe('Main Component', () => {
    // Helper function to render the Main component with required context
    const renderMainWithContext = () => {
        return render(<Main />);
    };

    it('renders without crashing', () => {
        renderMainWithContext();
    });

    it('displays a loading spinner initially', () => {
        renderMainWithContext();
        const loadingSpinner = screen.getByRole('alert');
        expect(loadingSpinner).toBeInTheDocument();
    });

    // Test cases for form submission
    it('submits the form with valid input', async () => {
        renderMainWithContext();

        // Wait for the loading spinner to disappear
        await waitFor(() => {
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        // Fill in valid input
        const inputText = 'Test post text';
        const textInput = screen.getByPlaceholderText(/What's on your mind/i);
        fireEvent.change(textInput, { target: { value: inputText } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: 'Post' }));

        // Add assertions for the success scenario, such as checking that the post is displayed.
    });

    it('displays validation error for empty input', async () => {
        renderMainWithContext();

        // Wait for the loading spinner to disappear
        await waitFor(() => {
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        // Submit the form without filling in any fields
        fireEvent.click(screen.getByRole('button', { name: 'Post' }));

        // Check that validation error is displayed
        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    // Add more specific tests for image upload functionality, error handling, and post rendering.

    it('renders posts correctly', async () => {
        // Render the Main component with predefined state (you can mock your context or use a library like Redux Mock Store for this)
        renderMainWithContext();

        // Wait for the loading spinner to disappear
        await waitFor(() => {
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        // Add assertions to check that posts are rendered correctly based on your mock state.
        // You can mock the state with posts and check if they are displayed as expected.
    });


});
