import { describe, it, expect, vi } from 'vitest';
import { ngoService } from './ngoService';
import * as apiClient from './apiClient';

vi.mock('./apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiPatch: vi.fn(),
}));

describe('ngoService', () => {
  it('calls list correctly', async () => {
    await ngoService.list();
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/ngos/');
  });

  it('calls getById correctly', async () => {
    await ngoService.getById('123');
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/ngos/123/');
  });

  it('calls getVerification correctly', async () => {
    await ngoService.getVerification('123');
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/ngos/123/verification/');
  });

  it('calls validateCnpj correctly', async () => {
    await ngoService.validateCnpj('12345');
    expect(apiClient.apiPost).toHaveBeenCalledWith('/ong-validation/', { cnpj: '12345' });
  });

  it('calls listCampaigns correctly', async () => {
    await ngoService.listCampaigns();
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/campaigns/');
  });

  it('calls getNgoCampaigns correctly', async () => {
    await ngoService.getNgoCampaigns('ngo-123');
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/ngos/ngo-123/campaigns/');
  });

  it('calls createCampaign correctly', async () => {
    const payload = { title: 'Test' };
    await ngoService.createCampaign('ngo-123', payload);
    expect(apiClient.apiPost).toHaveBeenCalledWith('/v1/ngos/ngo-123/campaigns/', payload);
  });

  it('calls updateCampaign correctly', async () => {
    const payload = { title: 'Test 2' };
    await ngoService.updateCampaign('camp-123', payload);
    expect(apiClient.apiPut).toHaveBeenCalledWith('/v1/campaigns/camp-123/', payload);
  });

  it('calls updateCampaignStatus correctly', async () => {
    await ngoService.updateCampaignStatus('camp-123', 'active');
    expect(apiClient.apiPatch).toHaveBeenCalledWith('/v1/campaigns/camp-123/status/', { status: 'active' });
  });

  it('calls listBundles correctly', async () => {
    await ngoService.listBundles();
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/bundles/');
  });

  it('calls getBundleById correctly', async () => {
    await ngoService.getBundleById('bundle-123');
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/bundles/bundle-123/');
  });
});
