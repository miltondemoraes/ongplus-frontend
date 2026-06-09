import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders correctly with default props', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Verifies brand exists
    expect(screen.getByText('ONG')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();

    // Verifies default links exist
    expect(screen.getByText('Explorar')).toBeInTheDocument();
    expect(screen.getByText('Causas')).toBeInTheDocument();
    expect(screen.getByText('Transparência')).toBeInTheDocument();
  });

  it('renders custom brand and rightContent', () => {
    render(
      <BrowserRouter>
        <Navbar 
          brand="TestBrand" 
          brandAccent="!" 
          rightContent={<button>LoginBtn</button>} 
        />
      </BrowserRouter>
    );

    expect(screen.getByText('TestBrand')).toBeInTheDocument();
    expect(screen.getByText('!')).toBeInTheDocument();
    
    // As the component duplicates rightContent for mobile and desktop, we might get multiple
    const buttons = screen.getAllByText('LoginBtn');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('triggers onBrandClick when brand is clicked', () => {
    const mockClick = vi.fn();
    render(
      <BrowserRouter>
        <Navbar brand="ClickMe" onBrandClick={mockClick} />
      </BrowserRouter>
    );

    const brandEl = screen.getByText('ClickMe');
    fireEvent.click(brandEl);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
