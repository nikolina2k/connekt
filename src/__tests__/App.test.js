import React from 'react';
import {render} from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App/>);

    });

    it('renders child components correctly', () => {
        const {getByTestId} = render(<App/>);

        // Ensure that the child components are present
        expect(getByTestId('app-context')).toBeInTheDocument();
        expect(getByTestId('pages')).toBeInTheDocument();

    });

});
