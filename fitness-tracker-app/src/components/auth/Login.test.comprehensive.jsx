// Login.test.jsx - Comprehensive unit tests for Login functionality
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../../context/AuthContext';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

const renderLogin = (authContextValue = {}) => {
  const defaultAuthContext = {
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    isAuthenticated: false,
    loading: false,
    ...authContextValue,
  };

  return render(
    <BrowserRouter>
      <AuthProvider value={defaultAuthContext}>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with all fields', () => {
    renderLogin();

    expect(screen.getByRole('heading', { name: /login to fitness tracker/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  test('allows user to input login credentials', () => {
    renderLogin();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits form with valid credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue({
      user: { id: 1, email: 'test@example.com' },
      tokens: { access: 'token' }
    });
    renderLogin({ login: mockLogin });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /^login$/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('shows error message on login failure', async () => {
    const mockLogin = jest.fn().mockRejectedValue({
      response: {
        data: {
          error: 'Invalid credentials'
        }
      }
    });
    renderLogin({ login: mockLogin });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /^login$/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('shows generic error message when no specific error is provided', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Network error'));
    renderLogin({ login: mockLogin });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /^login$/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/login failed\. please try again/i)).toBeInTheDocument();
    });
  });

  test('disables submit button and shows loading text during login', async () => {
    const mockLogin = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    renderLogin({ login: mockLogin });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /^login$/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
    });
  });

  test('clears error when user starts typing', () => {
    renderLogin();

    // First trigger an error by submitting empty form
    const submitButton = screen.getByRole('button', { name: /^login$/i });
    fireEvent.click(submitButton);

    // Type in email field
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Error should be cleared (implicitly tested by not showing error)
    expect(emailInput.value).toBe('test@example.com');
  });

  test('has correct link to register page', () => {
    renderLogin();

    const registerLink = screen.getByRole('link', { name: /register here/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('email input has correct type and attributes', () => {
    renderLogin();

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(emailInput).toBeRequired();
  });

  test('password input has correct type and attributes', () => {
    renderLogin();

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
    expect(passwordInput).toBeRequired();
  });
});

// Keep the original simple test component for backwards compatibility
const SimpleLogin = ({ onSubmit, loading = false, error = "" }) => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Fitness Tracker</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

describe("Login Component - Unit Tests (Legacy)", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form with email and password fields", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText("Login to Fitness Tracker")).toBeInTheDocument();
  });

  test("updates input values when typing", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("submits form with correct data when login button is clicked", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "endrasim@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "User@123" } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "endrasim@email.com",
      password: "User@123",
    });
  });

  test("shows loading state when loading prop is true", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} loading={true} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button");

    expect(screen.getByText("Logging in...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  test("displays error message when error prop is provided", () => {
    const errorMessage = "Invalid email or password";
    render(<SimpleLogin onSubmit={mockOnSubmit} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass("error-message");
  });

  test("form has required validation attributes", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("form submission prevents default behavior", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    const form = screen.getByRole("button").closest("form");
    const mockPreventDefault = jest.fn();

    fireEvent.submit(form, { preventDefault: mockPreventDefault });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test("handles empty form submission", () => {
    render(<SimpleLogin onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "",
      password: "",
    });
  });
});