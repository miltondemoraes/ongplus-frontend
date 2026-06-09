import { apiGet, apiPost, apiPut, apiPatch } from './apiClient';

export const ngoService = {
  async list() {
    return apiGet('/v1/ngos/');
  },

  async getById(id) {
    return apiGet(`/v1/ngos/${id}/`);
  },

  async getVerification(id) {
    return apiGet(`/v1/ngos/${id}/verification/`);
  },

  async validateCnpj(cnpj) {
    return apiPost('/ong-validation/', { cnpj });
  },

  async listCampaigns() {
    return apiGet('/v1/campaigns/');
  },

  async getNgoCampaigns(ngoId) {
    return apiGet(`/v1/ngos/${ngoId}/campaigns/`);
  },

  async createCampaign(ngoId, payload) {
    return apiPost(`/v1/ngos/${ngoId}/campaigns/`, payload);
  },

  async updateCampaign(campaignId, payload) {
    return apiPut(`/v1/campaigns/${campaignId}/`, payload);
  },

  async updateCampaignStatus(campaignId, status) {
    return apiPatch(`/v1/campaigns/${campaignId}/status/`, { status });
  },

  async listBundles() {
    return apiGet('/v1/bundles/');
  },

  async getBundleById(id) {
    return apiGet(`/v1/bundles/${id}/`);
  },
};
