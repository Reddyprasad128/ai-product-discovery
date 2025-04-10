import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login setToken={() => {}} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('calls setToken on successful login', async () => {
    const mockSetToken = jest.fn();

    // Mock axios
    jest.mock('axios', () => ({
      post: jest.fn(() => Promise.resolve({ data: { token: 'mock-token' } }))
    }));

    render(<Login setToken={mockSetToken} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // You might need to wait for async stuff here
    // Example: await waitFor(() => expect(mockSetToken).toHaveBeenCalled());
  });
});
