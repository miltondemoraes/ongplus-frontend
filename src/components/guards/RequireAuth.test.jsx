import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import * as AuthContext from '../../contexts/AuthContext';

describe('RequireAuth Guard', () => {
  it('redirects to login when user is not authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route path="/protected" element={
            <RequireAuth>
              <div data-testid="protected-content">Protected Content</div>
            </RequireAuth>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { id: 1, name: 'Test' } });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route path="/protected" element={
            <RequireAuth>
              <div data-testid="protected-content">Protected Content</div>
            </RequireAuth>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });
});
