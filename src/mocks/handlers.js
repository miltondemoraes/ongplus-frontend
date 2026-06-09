import { http, HttpResponse } from 'msw';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const handlers = [
  // Mock login endpoint
  http.post(`${BASE_URL}/v1/auth/login/`, () => {
    return HttpResponse.json({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token'
    });
  }),

  // Mock get me endpoint
  http.get(`${BASE_URL}/v1/auth/me/`, () => {
    return HttpResponse.json({
      id: 1,
      full_name: 'Test User',
      email: 'test@example.com',
      role: 'ngo_admin',
      ngo_profile: { id: 100, name: 'ONG Teste' }
    });
  }),

  // Mock logout endpoint
  http.post(`${BASE_URL}/v1/auth/logout/`, () => {
    return HttpResponse.json({ detail: 'Successfully logged out.' });
  }),

  // Mock transparency endpoints (simplified for useTransparency hook test)
  http.get(`${BASE_URL}/v1/ngos/:id/`, () => {
    return HttpResponse.json({ id: 'test-ong-id', name: 'ONG Test Profile' });
  }),
  http.get(`${BASE_URL}/v1/ngos/:id/verification/`, () => {
    return HttpResponse.json({ status: 'verified' });
  }),
  http.get(`${BASE_URL}/v1/transparency/ngos/:id/financial-data/`, () => {
    return HttpResponse.json({ balance: 1000 });
  }),
  http.get(`${BASE_URL}/v1/ngos/:id/campaigns/`, () => {
    return HttpResponse.json([]);
  }),
  http.get(`${BASE_URL}/v1/transparency/ngos/:id/change-history/`, () => {
    return HttpResponse.json([]);
  }),
  http.get(`${BASE_URL}/v1/transparency/ngos/:id/pending-requests/`, () => {
    return HttpResponse.json([]);
  }),
  http.get(`${BASE_URL}/v1/transparency/ngos/:id/documents/`, () => {
    return HttpResponse.json([]);
  }),
  http.get(`${BASE_URL}/v1/ngos/:id/data-sources/`, () => {
    return HttpResponse.json([]);
  })
];
