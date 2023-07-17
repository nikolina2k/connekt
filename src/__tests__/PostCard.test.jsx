import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from '../components/MainPage/PostCard';

describe('PostCard Component', () => {
    // Mock AuthContext for testing
    const AuthContext = {
        user: { uid: 'testUserId' },
    };

    it('renders without crashing', () => {
        render(
            <PostCard
                uid="testUserId"
                id="postId"
                logo="logo.png"
                name="Test User"
                text="This is a test post"
                email="test@example.com"
                image="postImage.png"
                timestamp="2023-09-19"
            />
        );
    });

    it('displays post author information', () => {
        render(
            <PostCard
                uid="testUserId"
                id="postId"
                logo="logo.png"
                name="Test User"
                text="This is a test post"
                email="test@example.com"
                image="postImage.png"
                timestamp="2023-09-19"
            />
        );

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('Published: 2023-09-19')).toBeInTheDocument();
    });

    it('displays like button', () => {
        render(
            <PostCard
                uid="testUserId"
                id="postId"
                logo="logo.png"
                name="Test User"
                text="This is a test post"
                email="test@example.com"
                image="postImage.png"
                timestamp="2023-09-19"
            />,
            {
                wrapper: ({ children }) => (
                    <AuthContext.Provider value={AuthContext}>{children}</AuthContext.Provider>
                ),
            }
        );

        expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
    });

    it('toggles like when the like button is clicked', () => {
        render(
            <PostCard
                uid="testUserId"
                id="postId"
                logo="logo.png"
                name="Test User"
                text="This is a test post"
                email="test@example.com"
                image="postImage.png"
                timestamp="2023-09-19"
            />,
            {
                wrapper: ({ children }) => (
                    <AuthContext.Provider value={AuthContext}>{children}</AuthContext.Provider>
                ),
            }
        );

        const likeButton = screen.getByRole('button', { name: 'Like' });
        fireEvent.click(likeButton);
        expect(screen.getByRole('button', { name: 'Unlike' })).toBeInTheDocument();
    });

    it('displays comment section when the "Comments" button is clicked', () => {
        render(
            <PostCard
                uid="testUserId"
                id="postId"
                logo="logo.png"
                name="Test User"
                text="This is a test post"
                email="test@example.com"
                image="postImage.png"
                timestamp="2023-09-19"
            />
        );

        const commentsButton = screen.getByRole('button', { name: 'Comments' });
        fireEvent.click(commentsButton);
        expect(screen.getByText('Comment Section')).toBeInTheDocument(); // Replace with actual comment section content
    });

    it('does not display delete button for posts from other users', () => {
        render(
            <PostCard
                uid="otherUserId"
                id="postId"
                logo="logo.png"
                name="Other User"
                text="This is another user's post"
                email="other@example.com"
                image="postImage.png"
                timestamp="2023-09-19"
            />,
            {
                wrapper: ({ children }) => (
                    <AuthContext.Provider value={AuthContext}>{children}</AuthContext.Provider>
                ),
            }
        );

        expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    });

    it('displays delete button for own posts', () => {
        render(
            <PostCard
                uid="testUserId"
                id="postId"
                logo="logo.png"
                name="Test User"
                text="This is a test post"
                email="test@example.com"
                image="postImage.png"
                timestamp="2023-09-19"
            />,
            {
                wrapper: ({ children }) => (
                    <AuthContext.Provider value={AuthContext}>{children}</AuthContext.Provider>
                ),
            }
        );

        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });


});
