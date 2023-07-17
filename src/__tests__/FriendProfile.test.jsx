import React from 'react';
import { render, screen } from '@testing-library/react';
import FriendProfile from './FriendProfile';
import { MemoryRouter, Route } from 'react-router-dom';

// Mock the onSnapshot function to provide test data
jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    onSnapshot: jest.fn(),
}));

const mockProfileData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    coverUrl: 'cover-image.jpg',
    image: 'avatar.jpg',
    location: 'New York',
    jobTitle: 'Software Engineer',
};

describe('FriendProfile Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <MemoryRouter initialEntries={['/profile/123']}>
                <Route path="/profile/:id">
                    <FriendProfile />
                </Route>
            </MemoryRouter>
        );
    });

    it('displays loading spinner initially', () => {
        render(
            <MemoryRouter initialEntries={['/profile/123']}>
                <Route path="/profile/:id">
                    <FriendProfile />
                </Route>
            </MemoryRouter>
        );

        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders user profile when data is available', async () => {
        const mockDoc = {
            data: () => mockProfileData,
        };
        const onSnapshotMock = jest.fn().mockImplementation((doc, callback) => {
            callback(mockDoc);
        });
        jest.mock('firebase/firestore', () => ({
            doc: jest.fn(),
            onSnapshot: onSnapshotMock,
        }));

        render(
            <MemoryRouter initialEntries={['/profile/123']}>
                <Route path="/profile/:id">
                    <FriendProfile />
                </Route>
            </MemoryRouter>
        );

        // Wait for the loading spinner to disappear
        await screen.findByRole('button', { name: 'Sign Up' });

        // Check that user profile data is displayed
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
        expect(screen.getByText('New York')).toBeInTheDocument();
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        expect(screen.getByAltText('avatar')).toBeInTheDocument();
    });


});
