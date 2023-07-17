import React from 'react';
import {render} from '@testing-library/react';
import Home from '../components/Pages/Home';

describe('Home Component', () => {
    it('renders without crashing', () => {
        render(<Home/>);
    });

    it('renders Navbar component', () => {
        const {getByTestId} = render(<Home/>);
        expect(getByTestId('navbar'))
            .toBeInTheDocument();
    });

    it('renders LeftSidebar component', () => {
        const {getByTestId} = render(<Home/>);
        expect(getByTestId('left-sidebar'))
            .toBeInTheDocument();
    });

    it('renders RightSidebar component', () => {
        const {getByTestId} = render(<Home/>);
        expect(getByTestId('right-sidebar'))
            .toBeInTheDocument();
    });

    it('renders CardArea component', () => {
        const {getByTestId} = render(<Home/>);
        expect(getByTestId('card-area'))
            .toBeInTheDocument();
    });

    it('renders Main component', () => {
        const {getByTestId} = render(<Home/>);
        expect(getByTestId('main'))
            .toBeInTheDocument();
    });

});
