import React from 'react';
import { render } from '@testing-library/react';
import Card from '../components/MainPage/Card';

describe('Card Component', () => {
    it('renders without crashing', () => {
        render(<Card name="Test User" img="test.jpg" status="Online" />);
    });

    it('displays the name, image, and online status correctly', () => {
        const { getByText, getByAltText } = render(
            <Card name="Test User" img="test.jpg" status="Online" />
        );

        const nameElement = getByText('Test User');
        const imageElement = getByAltText('Test User');
        const statusElement = getByText('Online');

        expect(nameElement).toBeInTheDocument();
        expect(imageElement).toBeInTheDocument();
        expect(statusElement).toBeInTheDocument();
    });

    it('displays offline status with correct color when status is "Offline"', () => {
        const { getByText } = render(
            <Card name="Test User" img="test.jpg" status="Offline" />
        );

        const statusElement = getByText('Offline');

        expect(statusElement).toBeInTheDocument();
        expect(statusElement).toHaveStyle('color: red');
    });

    it('displays online status with correct color when status is "Online"', () => {
        const { getByText } = render(
            <Card name="Test User" img="test.jpg" status="Online" />
        );

        const statusElement = getByText('Online');

        expect(statusElement).toBeInTheDocument();
        expect(statusElement).toHaveStyle('color: green');
    });

    it('applies hover effect on card', () => {
        const { container } = render(
            <Card name="Test User" img="test.jpg" status="Online" />
        );

        const cardElement = container.querySelector('.rounded-2xl');

        expect(cardElement).toBeInTheDocument();
        expect(cardElement).toHaveClass('hover:scale-105');
        expect(cardElement).toHaveClass('duration-700');
        expect(cardElement).toHaveClass('ease-in-out');
        expect(cardElement).toHaveClass('cursor-pointer');
    });


});
