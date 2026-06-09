import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import AdminDashboardPage from './AdminDashboardPage';
import { BrowserRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock useAuth
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Admin', email: 'admin@admin.com', role: 'admin' },
    login: vi.fn(),
    logout: vi.fn(),
  })
}));

const mockNgos = [
  { id: '1', name: 'ONG Teste Admin', cnpj: '123', status: 'verified', score: 90 },
];
const mockCampaigns = [
  { id: 'c1', name: 'Campanha Teste', status: 'em-revisao' },
];

const server = setupServer(
  http.get('http://localhost:8000/api/v1/admin/review/ngos/', () => HttpResponse.json(mockNgos)),
  http.get('http://localhost:8000/api/v1/admin/review/campaigns/', () => HttpResponse.json(mockCampaigns)),
  http.get('http://localhost:8000/api/v1/admin/ngos/', () => HttpResponse.json(mockNgos)),
  http.get('http://localhost:8000/api/v1/admin/campaigns/', () => HttpResponse.json(mockCampaigns)),
  http.get('http://localhost:8000/api/v1/admin/bundles/', () => HttpResponse.json([])),
  http.get('http://localhost:8000/api/v1/admin/score-criteria/', () => HttpResponse.json([]))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithContext = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AdminDashboardPage', () => {
  it('renders the dashboard with correct user info', async () => {
    renderWithContext(<AdminDashboardPage />);
    expect(screen.getByText('Gestão ONG+')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    
    // Wait for the data to load and remove the "Carregando painel..." message
    await waitFor(() => {
      expect(screen.queryByText('Carregando painel...')).not.toBeInTheDocument();
    });
  });

  it('renders the default tab (Revisão) and shows items', async () => {
    renderWithContext(<AdminDashboardPage />);
    
    await waitFor(() => {
      expect(screen.queryByText('Carregando painel...')).not.toBeInTheDocument();
    });

    // Check if the ONG is displayed in the "ONGs em revisão" section
    expect(screen.getByText('ONG Teste Admin')).toBeInTheDocument();
    expect(screen.getByText('Campanha Teste')).toBeInTheDocument();
  });
});
