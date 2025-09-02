import React from 'react';
import { render, screen } from '@testing-library/react';
import TenantOccupants from './TenantOccupants';

describe('TenantOccupants', () => {
  test('renders heading', () => {
    render(<TenantOccupants username="alice" />);
    expect(screen.getByText(/Occupants & Aadhaar/i)).toBeInTheDocument();
  });
});
