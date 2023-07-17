import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommentSection from '../components/MainPage/CommentSection';
import { AuthContext } from '../components/AppContext/AppContext';
import { db } from '../components/firebase/firebase';

// Mock the AuthContext
const mockUser = {
    uid: 'testUserId',
    photoURL: 'testAvatarUrl',
};

const mockUserData = {
    name: 'Test User',
    image: 'testUserImage',
};

const mockValue = {
    user: mockUser,
    userData: mockUserData,
};

jest.mock('../AppContext/AppContext', () => ({
    AuthContext: {
        Consumer: ({ children }) => children(mockValue),
    },
}));

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    onSnapshot: jest.fn(),
    orderBy: jest.fn(),
    query: jest.fn(),
    serverTimestamp: jest.fn(),
    setDoc: jest.fn(),
}));

// Mock Comment component
jest.mock('./Comment', () => ({
    __esModule: true,
    default: () => <div data-testid="comment">Mocked Comment</div>,
}));

describe('CommentSection Component', () => {
    it('renders without crashing', () => {
        render(<CommentSection postId="testPostId" />);
    });

    it('displays user avatar and comment input', () => {
        render(<CommentSection postId="testPostId" />);
        expect(screen.getByRole('img', { name: 'User Avatar' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Leave a comment...')).toBeInTheDocument();
    });

    it('adds a comment when the form is submitted', async () => {
        render(<CommentSection postId="testPostId" />);
        const commentInput = screen.getByPlaceholderText('Leave a comment...');
        const submitButton = screen.getByRole('button', { name: 'Comment' });

        // Simulate user typing a comment
        fireEvent.change(commentInput, { target: { value: 'Test comment' } });

        // Simulate form submission
        fireEvent.click(submitButton);

        // Add assertions to check if the comment is added
        // You would need to mock Firestore functions to return the expected data
        // and verify that the comment is displayed on the component.
    });

    it('displays comments correctly', async () => {
        // Mock Firestore functions to return sample comments data
        const mockComments = [
            {
                uid: 'testUserId',
                id: 'commentId1',
                comment: 'Test comment 1',
                timestamp: { toDate: () => new Date() },
            },
            {
                uid: 'testUserId',
                id: 'commentId2',
                comment: 'Test comment 2',
                timestamp: { toDate: () => new Date() },
            },
        ];

        // Mock Firestore onSnapshot to call the callback with sample comments
        const onSnapshotMock = jest.fn().mockImplementation((query, callback) => {
            callback({
                docs: mockComments.map((comment) => ({ data: () => comment })),
            });
        });

        jest.spyOn(db, 'collection').mockReturnValue({
            doc: jest.fn().mockReturnValue({
                comments: 'commentsCollection',
            }),
        });

        jest.spyOn(db, 'query').mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
                get: jest.fn(),
            }),
        });

        jest.spyOn(db, 'onSnapshot').mockImplementation(onSnapshotMock);

        render(<CommentSection postId="testPostId" />);

        // Verify that the mocked Comment component is displayed for each comment
        expect(screen.getAllByTestId('comment')).toHaveLength(2);
    });

});
