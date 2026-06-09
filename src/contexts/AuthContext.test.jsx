import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { act } from 'react';

// Simple component to test the context
function TestComponent() {
  const { user, login, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="user-status">{user ? `Logged in as ${user.name}` : 'Not logged in'}</div>
      <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides loading state initially when checking token', async () => {
    localStorage.setItem('@ongplus:token', 'fake-token');
    
    const { container } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state is loading, so AuthProvider renders nothing (children not rendered)
    expect(screen.queryByTestId('user-status')).not.toBeInTheDocument();

    // After fetch completes, user is logged in (mock responds with Test User)
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as Test User');
    });
  });

  it('allows user to login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');

    act(() => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as Test User');
    });
    
    expect(localStorage.getItem('@ongplus:token')).toBe('mock-access-token');
  });

  it('allows user to logout', async () => {
    localStorage.setItem('@ongplus:token', 'fake-token');
    localStorage.setItem('@ongplus:refresh_token', 'fake-refresh');
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as Test User');
    });

    act(() => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
    
    expect(localStorage.getItem('@ongplus:token')).toBeNull();
  });

  it('clears token on init if fetch me fails', async () => {
    localStorage.setItem('@ongplus:token', 'invalid-token');
    
    // We will mock fetch to return 401 just for this test
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ detail: 'Unauthorized' })
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });

    expect(localStorage.getItem('@ongplus:token')).toBeNull();
    global.fetch = originalFetch;
  });

  it('allows user to update profile', async () => {
    // Mock user login first
    localStorage.setItem('@ongplus:token', 'fake-token');
    
    const ComponentWithUpdate = () => {
      const { user, updateUser, loading } = useAuth();
      if (loading) return null;
      return (
        <div>
          <div data-testid="user-name">{user?.name}</div>
          <button onClick={() => updateUser({ name: 'Updated Name', email: 'up@example.com' })}>Update</button>
        </div>
      );
    };

    const originalFetch = global.fetch;
    global.fetch = vi.fn()
      // Initial me
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ id: 1, full_name: 'Test User' })
      })
      // update me
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ id: 1, full_name: 'Updated Name', email: 'up@example.com' })
      });

    render(
      <AuthProvider>
        <ComponentWithUpdate />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    });

    act(() => {
      screen.getByText('Update').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Updated Name');
    });

    global.fetch = originalFetch;
  });

  it('logs error on logout failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('@ongplus:refresh_token', 'fake-refresh');
    
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Logout error', expect.any(Error));
    });

    consoleSpy.mockRestore();
    global.fetch = originalFetch;
  });
});

describe('useAuth outside provider', () => {
  it('throws an error', () => {
    // Suppress console.error from React about unhandled error boundary
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow('useAuth deve ser usado dentro de um AuthProvider');
    
    consoleSpy.mockRestore();
  });
});
