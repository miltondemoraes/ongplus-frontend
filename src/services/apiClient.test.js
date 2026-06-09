import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiDownload, apiUpload, saveBlob } from './apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    Storage.prototype.getItem = vi.fn();
    Storage.prototype.removeItem = vi.fn();
    global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/test');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('apiGet performs a GET request with auth header', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('fake-token');
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ data: 'ok' }),
    });

    const res = await apiGet('/test');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-token',
      },
    });
    expect(res.data).toBe('ok');
  });

  it('apiPost performs a POST request', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ id: 1 }),
    });

    const res = await apiPost('/test', { name: 'foo' });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ name: 'foo' }),
    }));
    expect(res.id).toBe(1);
  });

  it('apiPut performs a PUT request', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ id: 1 }),
    });

    const res = await apiPut('/test', { name: 'foo' });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({
      method: 'PUT',
    }));
    expect(res.id).toBe(1);
  });

  it('apiPatch performs a PATCH request', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ id: 1 }),
    });

    const res = await apiPatch('/test', { name: 'foo' });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({
      method: 'PATCH',
    }));
    expect(res.id).toBe(1);
  });

  it('apiDelete performs a DELETE request', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ deleted: true }),
    });

    const res = await apiDelete('/test');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({
      method: 'DELETE',
    }));
    expect(res.deleted).toBe(true);
  });

  it('throws an error on 401 and clears local storage', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ detail: 'Token expirado' }),
    });

    await expect(apiGet('/test')).rejects.toThrow('Token expirado');
    expect(localStorage.removeItem).toHaveBeenCalledWith('@ongplus:token');
  });

  it('handles empty response gracefully', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => '',
    });

    const res = await apiGet('/test');
    expect(res).toBeNull();
  });

  it('handles invalid json error response gracefully', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });

    await expect(apiGet('/test')).rejects.toThrow('Internal Server Error');
  });

  it('extractApiErrorMessage handles complex objects', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({
        field: ['Required'],
        nested: { inner: 'Error' }
      }),
    });

    await expect(apiGet('/test')).rejects.toThrow('field: Required inner: Error');
  });

  it('apiUpload sends FormData', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ uploaded: true }),
    });
    
    const fd = new FormData();
    fd.append('file', new Blob());

    const res = await apiUpload('/upload', fd);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/upload'), expect.objectContaining({
      method: 'POST',
      body: fd,
    }));
    expect(res.uploaded).toBe(true);
  });

  it('apiDownload returns blob and filename', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['test']),
      headers: new Headers({ 'Content-Disposition': 'attachment; filename="test.pdf"' })
    });

    const res = await apiDownload('/download');
    expect(res.filename).toBe('test.pdf');
    expect(res.blob).toBeInstanceOf(Blob);
  });

  it('apiDownload handles error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ error: 'File not found' })
    });

    await expect(apiDownload('/download')).rejects.toThrow('File not found');
  });

  it('saveBlob triggers download', () => {
    const mockClick = vi.fn();
    const mockElement = { href: '', download: '', click: mockClick };
    vi.spyOn(document, 'createElement').mockReturnValue(mockElement);

    saveBlob(new Blob(['test']), 'test.pdf');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockElement.download).toBe('test.pdf');
    expect(mockClick).toHaveBeenCalled();
  });
});
