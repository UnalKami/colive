import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

describe('Login component', () => {
  test('renders login form', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText('Correo de usuario');
    const passwordInput = screen.getByLabelText('Contraseña');
    const loginButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('displays alert message when inputs are empty', () => {
    render(<Login />);
    
    const loginButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    fireEvent.click(loginButton);

    const alertMessage = screen.getByText('Por favor llena todos los campos');
    expect(alertMessage).toBeInTheDocument();
  });

  test('calls loginUser function when inputs are filled', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText('Correo de usuario');
    const passwordInput = screen.getByLabelText('Contraseña');
    const loginButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    // Add assertions for the expected behavior after calling loginUser function
  });

  // Add more tests for other scenarios and edge cases
});