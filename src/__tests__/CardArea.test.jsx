import React from 'react';
import { render, screen } from '@testing-library/react';
import CardArea from '../components/MainPage/CardArea';

describe('CardArea Component', () => {
    // Test 1: Check if CardArea renders without crashing
    it('renders without crashing', () => {
        render(<CardArea />);
    });

    // Test 2: Check if CardArea displays cards from cardData
    it('displays cards from cardData', () => {
        render(<CardArea />);

        // Iterate through each card in cardData and check if it's displayed
        cardData.forEach((card) => {
            expect(screen.getByText(card.name)).toBeInTheDocument();
            expect(screen.getByAltText(card.name)).toBeInTheDocument();
            expect(screen.getByText(card.status)).toBeInTheDocument();
        });
    });

    // Test 3: Check if the correct number of cards is displayed
    it('displays the correct number of cards', () => {
        render(<CardArea />);

        // Check if the number of cards rendered matches the length of cardData
        const cards = screen.getAllByRole('img', { name: /Card Image/i });
        expect(cards).toHaveLength(cardData.length);
    });

    // Test 4: Check if each card has a unique key
    it('assigns a unique key to each card', () => {
        render(<CardArea />);

        // Get an array of card elements
        const cards = screen.getAllByRole('img', { name: /Card Image/i });

        // Extract the 'key' prop from each card and check for uniqueness
        const keys = cards.map((card) => card.getAttribute('key'));
        const uniqueKeys = [...new Set(keys)];

        // The number of unique keys should be the same as the number of cards
        expect(uniqueKeys.length).toEqual(cards.length);
    });

});
