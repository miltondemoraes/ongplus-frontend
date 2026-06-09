import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

// Mock the Footer since it has links and might need its own specific context or routing
vi.mock('../components/Footer', () => {
  return {
    default: () => <div data-testid="mock-footer">Footer</div>
  };
});

describe('LandingPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders main sections correctly', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Hero section
    expect(screen.getByText(/Conectando/i)).toBeInTheDocument();
    expect(screen.getByText(/Impacto Real/i)).toBeInTheDocument();

    // Features section
    expect(screen.getByText('Um Ecossistema de Confiança')).toBeInTheDocument();
    expect(screen.getByText('Para Doadores')).toBeInTheDocument();
    expect(screen.getByText('Para ONGs')).toBeInTheDocument();

    // HowItWorks section
    expect(screen.getByText('Como Funciona')).toBeInTheDocument();
    expect(screen.getByText('Escolha uma campanha coletiva')).toBeInTheDocument();

    // CTA section
    expect(screen.getByText('Pronto para fazer a diferença?')).toBeInTheDocument();

    // Footer mock
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('shows warning modal on first visit and allows dismissing it', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Modal should be visible
    expect(screen.getByText('Aviso Importante')).toBeInTheDocument();
    
    // Dismiss the modal
    const dismissButton = screen.getByText('Entendi e declaro ciente');
    fireEvent.click(dismissButton);

    // Modal should disappear
    expect(screen.queryByText('Aviso Importante')).not.toBeInTheDocument();

    // Local storage should be updated
    expect(localStorage.getItem('ongplus_warning_dismissed')).toBe('true');
  });

  it('does not show warning modal if already dismissed', () => {
    localStorage.setItem('ongplus_warning_dismissed', 'true');
    
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Modal should not be visible
    expect(screen.queryByText('Aviso Importante')).not.toBeInTheDocument();
  });

  it('triggers onExploreCauses callback', () => {
    const mockExplore = vi.fn();
    render(
      <BrowserRouter>
        <LandingPage onExploreCauses={mockExplore} />
      </BrowserRouter>
    );

    // Click the explore button in Hero (first one)
    const exploreBtns = screen.getAllByText('Explorar Causas');
    fireEvent.click(exploreBtns[0]);

    expect(mockExplore).toHaveBeenCalledTimes(1);
  });
});
