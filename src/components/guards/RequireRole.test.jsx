import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireRole from './RequireRole';
import * as AuthContext from '../../contexts/AuthContext';

describe('RequireRole Guard', () => {
  it('redirects to login when user is not authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route path="/admin" element={
            <RequireRole allowedRoles={['admin']}>
              <div data-testid="admin-content">Admin Content</div>
            </RequireRole>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('redirects to root when user does not have allowed role', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { id: 1, role: 'donor' } });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
          <Route path="/admin" element={
            <RequireRole allowedRoles={['admin', 'ong']}>
              <div data-testid="admin-content">Admin Content</div>
            </RequireRole>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
  });

  it('renders children when user has allowed role', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { id: 1, role: 'ong' } });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
          <Route path="/dashboard" element={
            <RequireRole allowedRoles={['ong']}>
              <div data-testid="dashboard-content">Dashboard Content</div>
            </RequireRole>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
  });
});
