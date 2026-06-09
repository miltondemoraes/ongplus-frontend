import { describe, it, expect, vi } from 'vitest';
import { adminService } from './adminService';
import * as apiClient from './apiClient';

vi.mock('./apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
}));

describe('adminService', () => {
  it('calls listReviewNgos correctly', async () => {
    await adminService.listReviewNgos();
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/admin/review/ngos/');
  });

  it('calls updateNgoVerification correctly', async () => {
    await adminService.updateNgoVerification('123', 'verified');
    expect(apiClient.apiPatch).toHaveBeenCalledWith('/v1/admin/ngos/123/verification/', { status: 'verified' });
  });

  it('calls validateNgo correctly', async () => {
    await adminService.validateNgo('123');
    expect(apiClient.apiPost).toHaveBeenCalledWith('/v1/admin/ngos/123/validate/');
  });

  it('calls reviewCampaign correctly', async () => {
    await adminService.reviewCampaign('456', 'aprovada');
    expect(apiClient.apiPatch).toHaveBeenCalledWith('/v1/admin/campaigns/456/review/', { status: 'aprovada' });
  });

  it('calls createBundle correctly', async () => {
    const payload = { name: 'Test', targetAmount: 100 };
    await adminService.createBundle(payload);
    expect(apiClient.apiPost).toHaveBeenCalledWith('/v1/admin/bundles/create/', payload);
  });

  it('calls addNgoToBundle correctly', async () => {
    await adminService.addNgoToBundle('bundle1', 'ngo2');
    expect(apiClient.apiPost).toHaveBeenCalledWith('/v1/admin/bundles/bundle1/ngos/', { ngoId: 'ngo2' });
  });

  it('calls deleteNgo correctly', async () => {
    await adminService.deleteNgo('ngo-123');
    expect(apiClient.apiDelete).toHaveBeenCalledWith('/v1/admin/ngos/ngo-123/');
  });

  it('calls listReviewCampaigns correctly', async () => {
    await adminService.listReviewCampaigns();
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/admin/review/campaigns/');
  });

  it('calls listNgos correctly', async () => {
    await adminService.listNgos();
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/admin/ngos/');
  });

  it('calls getNgoDocuments correctly', async () => {
    await adminService.getNgoDocuments('ngo-123');
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/admin/ngos/ngo-123/documents/');
  });

  it('calls updateNgoScore correctly', async () => {
    await adminService.updateNgoScore('ngo-123', 85);
    expect(apiClient.apiPatch).toHaveBeenCalledWith('/v1/admin/ngos/ngo-123/score/', { score: 85 });
  });

  it('calls listCampaigns correctly', async () => {
    await adminService.listCampaigns();
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/admin/campaigns/');
  });

  it('calls endCampaign correctly', async () => {
    await adminService.endCampaign('camp-123');
    expect(apiClient.apiPatch).toHaveBeenCalledWith('/v1/admin/campaigns/camp-123/end/');
  });

  it('calls getScoreCriteria correctly', async () => {
    await adminService.getScoreCriteria();
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/admin/score-criteria/');
  });

  it('calls listBundles correctly', async () => {
    await adminService.listBundles();
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/admin/bundles/');
  });

  it('calls updateBundle correctly', async () => {
    await adminService.updateBundle('bundle-123', { name: 'New Name' });
    expect(apiClient.apiPatch).toHaveBeenCalledWith('/v1/admin/bundles/bundle-123/', { name: 'New Name' });
  });

  it('calls removeNgoFromBundle correctly', async () => {
    await adminService.removeNgoFromBundle('bundle-123', 'ngo-123');
    expect(apiClient.apiDelete).toHaveBeenCalledWith('/v1/admin/bundles/bundle-123/ngos/ngo-123/');
  });

  it('calls endBundle correctly', async () => {
    await adminService.endBundle('bundle-123');
    expect(apiClient.apiPatch).toHaveBeenCalledWith('/v1/admin/bundles/bundle-123/end/');
  });
});
