import { render, screen } from '@testing-library/react';
import App from './App';

// Helper to set localStorage before rendering
const withUser = (user) => {
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
};

beforeEach(()=>{ localStorage.clear(); });

test('shows Login when no user in storage', () => {
  withUser(null);
  render(<App />);
  expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
});

test('shows Occupants nav link for tenant after login', () => {
  withUser({ username: 'alice', role: 'TENANT' });
  render(<App />);
  // Should render nav with Occupants link
  expect(screen.getByText(/Occupants/i)).toBeInTheDocument();
});
