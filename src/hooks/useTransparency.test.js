import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTransparency } from './useTransparency';

describe('useTransparency', () => {
  it('initializes with loading state', async () => {
    const { result } = renderHook(() => useTransparency('test-ong-id'));

    // Should immediately be in loading state
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    
    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('fetches and populates data correctly', async () => {
    const { result } = renderHook(() => useTransparency('test-ong-id'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data.profile.name).toBe('ONG Test Profile');
    expect(result.current.data.verification.status).toBe('verified');
    expect(result.current.data.financial.balance).toBe(1000);
    expect(result.current.data.campaigns).toEqual([]);
    expect(result.current.data.changeHistory).toEqual([]);
    expect(result.current.data.pendingRequests).toEqual([]);
    expect(result.current.data.documents).toEqual([]);
    expect(result.current.data.dataSources).toEqual([]);
  });

  it('does nothing if no ongId is provided', async () => {
    const { result } = renderHook(() => useTransparency(null));

    // Will immediately set loading false because ongId is falsy
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data.profile).toBeNull();
  });

  it('handles load failure gracefully', async () => {
    // Mock the global console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // We mock fetch inside setupServer, but since this test uses vitest mocks,
    // we should override the transparencyService mock instead. But it's not mocked here.
    // The service is actually hitting the MSW server because we didn't mock it in this file.
    // We can use a mocked fetch to force error.
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useTransparency('test-ong-id'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Não foi possível carregar os dados de transparência. Tente novamente.');
    
    consoleSpy.mockRestore();
    global.fetch = originalFetch;
  });

  it('submitChangeRequest works', async () => {
    const originalFetch = global.fetch;
    // mock loadData success
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, text: async () => JSON.stringify({ ok: true }) }) // submit
      .mockResolvedValue({ ok: true, text: async () => JSON.stringify({}) }); // subsequent loads
      
    const { result } = renderHook(() => useTransparency('test-ong-id'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const res = await result.current.submitChangeRequest({ field: 'name', newValue: 'new name', justification: 'cuz' });
    expect(res.success).toBe(true);

    global.fetch = originalFetch;
  });

  it('approveRequest works', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, text: async () => JSON.stringify({ ok: true }) }) 
      .mockResolvedValue({ ok: true, text: async () => JSON.stringify({}) }); 
      
    const { result } = renderHook(() => useTransparency('test-ong-id'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const res = await result.current.approveRequest('req1');
    expect(res.success).toBe(true);

    global.fetch = originalFetch;
  });

  it('rejectRequest works', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, text: async () => JSON.stringify({ ok: true }) }) 
      .mockResolvedValue({ ok: true, text: async () => JSON.stringify({}) }); 
      
    const { result } = renderHook(() => useTransparency('test-ong-id'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const res = await result.current.rejectRequest('req1');
    expect(res.success).toBe(true);

    global.fetch = originalFetch;
  });
});
