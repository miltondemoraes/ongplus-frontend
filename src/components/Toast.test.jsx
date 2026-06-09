import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Toast from './Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    window.requestAnimationFrame.mockRestore();
  });

  it('does not render when message is empty', () => {
    const { container } = render(<Toast message="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the message when provided', () => {
    render(<Toast message="Test success message" type="success" />);
    
    expect(screen.getByText('Test success message')).toBeInTheDocument();
  });

  it('calls onClose and hides when close button is clicked', () => {
    const mockClose = vi.fn();
    render(<Toast message="Close me" onClose={mockClose} />);
    
    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);
    
    // Simulate the setTimeout for onClose (300ms transition)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('auto-closes after the duration', () => {
    const mockClose = vi.fn();
    render(<Toast message="Auto close" duration={2000} onClose={mockClose} />);
    
    // Advance timers past the duration (2000ms)
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    // Advance timers for the CSS transition (300ms)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
