import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Form from './Form';
import rootReducer from '../store';
import axios from 'axios';
jest.mock('axios');

const renderWithProviders = (ui, { reduxState } = {}) => {
    const store = configureStore({ reducer: rootReducer, preloadedState: reduxState });
    return render(<Provider store={store}>{ui}</Provider>);
};

test('renders form component correctly', () => {
    renderWithProviders(<Form />);
    expect(screen.getByText(/Formularz/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kontynent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Imię/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nazwisko/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data urodzenia/i)).toBeInTheDocument();
    expect(screen.getByText(/Wyślij/i)).toBeInTheDocument();
});

test('updates form inputs correctly', () => {
    renderWithProviders(<Form />);
    fireEvent.change(screen.getByLabelText(/Imię/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Nazwisko/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Kontynent/i), { target: { value: 'Europa' } });

    expect(screen.getByLabelText(/Imię/i).value).toBe('John');
    expect(screen.getByLabelText(/Nazwisko/i).value).toBe('Doe');
    expect(screen.getByLabelText(/Kontynent/i).value).toBe('Europa');
});

test('disables submit button for future dates', () => {
    renderWithProviders(<Form />);
    const dateInput = screen.getByLabelText(/Data urodzenia/i);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    fireEvent.change(dateInput, { target: { value: futureDate.toISOString().split('T')[0] } });

    const submitButton = screen.getByText(/Wyślij/i);
    expect(submitButton).toBeDisabled();
});

test('handles form submission correctly', async () => {
    renderWithProviders(<Form />);
    fireEvent.change(screen.getByLabelText(/Imię/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Nazwisko/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Kontynent/i), { target: { value: 'Europa' } });
    fireEvent.change(screen.getByLabelText(/Data urodzenia/i), { target: { value: '2000-01-01' } });

    const submitButton = screen.getByText(/Wyślij/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(screen.getByText(/Data saved successfully/i)).toBeInTheDocument();
    });
});

test('deletes a single user', async () => {
    renderWithProviders(<Form />);
    const formList = [{ id: 1, kontynent: 'Europa', imie: 'John', nazwisko: 'Doe', dataUrodzenia: '2000-01-01' }];
    renderWithProviders(<Form />, { reduxState: { formList } });

    const deleteIcon = screen.getByTestId('delete-user-icon-1');
    fireEvent.click(deleteIcon);

    await waitFor(() => {
        expect(screen.queryByText('John')).not.toBeInTheDocument();
    });
});

test('deletes all users', async () => {
    renderWithProviders(<Form />);
    const formList = [
        { id: 1, kontynent: 'Europa', imie: 'John', nazwisko: 'Doe', dataUrodzenia: '2000-01-01' },
        { id: 2, kontynent: 'Europa', imie: 'Jane', nazwisko: 'Smith', dataUrodzenia: '1990-01-01' },
    ];
    renderWithProviders(<Form />, { reduxState: { formList } });

    const deleteAllButton = screen.getByText(/Usuń wszystkich/i);
    fireEvent.click(deleteAllButton);

    const confirmButton = screen.getByText(/Potwierdź/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
        expect(screen.queryByText('John')).not.toBeInTheDocument();
        expect(screen.queryByText('Jane')).not.toBeInTheDocument();
    });
});

test('views user details', async () => {
    renderWithProviders(<Form />);
    const formList = [{ id: 1, kontynent: 'Europa', imie: 'John', nazwisko: 'Doe', dataUrodzenia: '2000-01-01' }];
    renderWithProviders(<Form />, { reduxState: { formList } });

    const viewIcon = screen.getByTestId('view-user-icon-1');
    fireEvent.click(viewIcon);

    await waitFor(() => {
        expect(screen.getByText(/Dane szczegółowe/i)).toBeInTheDocument();
        expect(screen.getByText(/Imię: John/i)).toBeInTheDocument();
        expect(screen.getByText(/Nazwisko: Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/Kontynent: Europa/i)).toBeInTheDocument();
        expect(screen.getByText(/Data urodzenia: 2000-01-01/i)).toBeInTheDocument();
    });
});
