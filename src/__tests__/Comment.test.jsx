import React from 'react';
import { render } from '@testing-library/react';
import Comment from '../components/MainPage/Comment';

describe('Comment Component', () => {
    it('renders a comment with name and text', () => {
        // Arrange
        const name = 'John Doe';
        const commentText = 'This is a test comment';
        const image = 'path/to/avatar.png';

        // Act
        const { getByText, getByAltText } = render(
            <Comment name={name} comment={commentText} image={image} />
        );

        // Assert
        expect(getByText(name)).toBeInTheDocument();
        expect(getByText(commentText)).toBeInTheDocument();
        expect(getByAltText('avatar')).toBeInTheDocument();
    });

    it('renders a comment without an image', () => {
        // Arrange
        const name = 'Jane Smith';
        const commentText = 'Another comment without an image';

        // Act
        const { getByText, queryByAltText } = render(
            <Comment name={name} comment={commentText} />
        );

        // Assert
        expect(getByText(name)).toBeInTheDocument();
        expect(getByText(commentText)).toBeInTheDocument();
        expect(queryByAltText('avatar')).toBeNull();
    });

    it('renders a comment with default image if no image prop is provided', () => {
        // Arrange
        const name = 'Anonymous';
        const commentText = 'Comment with default image';

        // Act
        const { getByText, getByAltText } = render(
            <Comment name={name} comment={commentText} />
        );

        // Assert
        expect(getByText(name)).toBeInTheDocument();
        expect(getByText(commentText)).toBeInTheDocument();
        expect(getByAltText('avatar')).toBeInTheDocument();
    });

    it('handles long comments by truncating them', () => {
        // Arrange
        const name = 'Long Commenter';
        const longCommentText =
            'This is a really long comment that should be truncated to fit within the container.';

        // Act
        const { getByText } = render(
            <Comment name={name} comment={longCommentText} />
        );

        // Assert
        expect(getByText('...')).toBeInTheDocument();
    });

    it('handles comments with special characters', () => {
        // Arrange
        const name = 'Special Character User';
        const specialCommentText = '<script>alert("Dangerous comment!")</script>';

        // Act
        const { getByText } = render(
            <Comment name={name} comment={specialCommentText} />
        );

        // Assert
        expect(getByText(specialCommentText)).toBeInTheDocument();
    });


});
