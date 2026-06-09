import { describe, it, expect, vi } from 'vitest';
import { transparencyService, getAllocationCriteria } from './transparencyService';
import { ngoService } from './ngoService';
import * as apiClient from './apiClient';

vi.mock('./apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiDelete: vi.fn(),
  apiDownload: vi.fn(),
  apiUpload: vi.fn(),
  saveBlob: vi.fn(),
}));

vi.mock('./ngoService', () => ({
  ngoService: {
    getById: vi.fn(),
    getVerification: vi.fn(),
    getNgoCampaigns: vi.fn(),
  }
}));

describe('transparencyService', () => {
  it('getNGOProfile maps response correctly', async () => {
    ngoService.getById.mockResolvedValueOnce({
      id: 1, name: 'Test', cnpj: '123', score: 90
    });
    const res = await transparencyService.getNGOProfile(1);
    expect(res.id).toBe(1);
    expect(res.name).toBe('Test');
    expect(res.score).toBe(90);
  });

  it('getVerificationData calls ngoService', async () => {
    ngoService.getVerification.mockResolvedValueOnce({ status: 'verified' });
    const res = await transparencyService.getVerificationData(1);
    expect(res.status).toBe('verified');
  });

  it('getFinancialData calls apiGet', async () => {
    apiClient.apiGet.mockResolvedValueOnce({ balance: 100 });
    const res = await transparencyService.getFinancialData(1);
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/transparency/ngos/1/financial-data/');
    expect(res.balance).toBe(100);
  });

  it('getCampaignHistory maps response correctly', async () => {
    ngoService.getNgoCampaigns.mockResolvedValueOnce([
      { id: 1, name: 'Camp 1', status: 'active' }
    ]);
    const res = await transparencyService.getCampaignHistory(1);
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe('Camp 1');
  });

  it('getChangeHistory maps response correctly', async () => {
    apiClient.apiGet.mockResolvedValueOnce([
      { id: 1, field: 'name', oldValue: 'A', newValue: 'B' }
    ]);
    const res = await transparencyService.getChangeHistory(1);
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/transparency/ngos/1/change-history/');
    expect(res).toHaveLength(1);
    expect(res[0].field).toBe('name');
  });

  it('getPendingRequests maps response correctly', async () => {
    apiClient.apiGet.mockResolvedValueOnce([
      { id: 1, field_name: 'name', old_value: 'A', new_value: 'B' }
    ]);
    const res = await transparencyService.getPendingRequests(1);
    expect(res).toHaveLength(1);
    expect(res[0].field).toBe('name');
    expect(res[0].oldValue).toBe('A');
  });

  it('getChangeRequests maps response correctly', async () => {
    apiClient.apiGet.mockResolvedValueOnce([{ id: 2, field: 'phone' }]);
    const res = await transparencyService.getChangeRequests(1);
    expect(res).toHaveLength(1);
    expect(res[0].field).toBe('phone');
  });

  it('listReports calls apiGet', async () => {
    await transparencyService.listReports(1);
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/transparency/ngos/1/reports/');
  });

  it('clearReports calls apiDelete', async () => {
    await transparencyService.clearReports(1);
    expect(apiClient.apiDelete).toHaveBeenCalledWith('/v1/transparency/ngos/1/reports/');
  });

  it('generateReport calls apiPost', async () => {
    await transparencyService.generateReport(1, { foo: 'bar' });
    expect(apiClient.apiPost).toHaveBeenCalledWith('/v1/transparency/ngos/1/reports/generate/', { foo: 'bar' });
  });

  it('downloadReport calls apiDownload', async () => {
    await transparencyService.downloadReport('ong1', 'rep1');
    expect(apiClient.apiDownload).toHaveBeenCalledWith(
      '/v1/transparency/ngos/ong1/reports/rep1/download/',
      'relatorio-rep1.pdf'
    );
  });

  it('generateAndDownloadReport orchestrates calls', async () => {
    apiClient.apiPost.mockResolvedValueOnce({ report: { id: 'rep12345678' } });
    apiClient.apiDownload.mockResolvedValueOnce({ blob: new Blob(), filename: 'test.pdf' });
    
    const res = await transparencyService.generateAndDownloadReport('ong1', {});
    expect(apiClient.apiPost).toHaveBeenCalled();
    expect(apiClient.apiDownload).toHaveBeenCalled();
    expect(apiClient.saveBlob).toHaveBeenCalled();
    expect(res.id).toBe('rep12345678');
  });

  it('generateAndDownloadReport throws if no id', async () => {
    apiClient.apiPost.mockResolvedValueOnce({ report: {} });
    await expect(transparencyService.generateAndDownloadReport('ong1', {})).rejects.toThrow('válido');
  });

  it('submitChangeRequest calls apiPost', async () => {
    await transparencyService.submitChangeRequest(1, { field: 'name' });
    expect(apiClient.apiPost).toHaveBeenCalledWith('/v1/transparency/ngos/1/requests/', { field: 'name' });
  });

  it('approveChangeRequest calls apiPost', async () => {
    await transparencyService.approveChangeRequest(1);
    expect(apiClient.apiPost).toHaveBeenCalledWith('/v1/transparency/requests/1/approve/', {});
  });

  it('rejectChangeRequest calls apiPost', async () => {
    await transparencyService.rejectChangeRequest(1);
    expect(apiClient.apiPost).toHaveBeenCalledWith('/v1/transparency/requests/1/reject/', {});
  });

  it('getDocuments calls apiGet', async () => {
    await transparencyService.getDocuments(1);
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/transparency/ngos/1/documents/');
  });

  it('uploadDocument calls apiUpload', async () => {
    apiClient.apiUpload.mockResolvedValueOnce({ id: 1, title: 'Doc' });
    const res = await transparencyService.uploadDocument(1, new Blob(), { title: 'Doc' });
    expect(apiClient.apiUpload).toHaveBeenCalled();
    expect(res.title).toBe('Doc');
  });

  it('getDataSources calls apiGet', async () => {
    await transparencyService.getDataSources(1);
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/ngos/1/data-sources/');
  });

  it('getAllocationCriteria calls apiGet', async () => {
    await getAllocationCriteria();
    expect(apiClient.apiGet).toHaveBeenCalledWith('/v1/transparency/allocation-criteria/');
  });
});
