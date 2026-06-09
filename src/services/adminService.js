import { apiGet, apiPost, apiPatch, apiDelete } from './apiClient';

export const adminService = {
  async listReviewNgos() {
    return apiGet('/v1/admin/review/ngos/');
  },

  async listReviewCampaigns() {
    return apiGet('/v1/admin/review/campaigns/');
  },

  async listNgos() {
    return apiGet('/v1/admin/ngos/');
  },

  async getNgoDocuments(ngoId) {
    return apiGet(`/v1/admin/ngos/${ngoId}/documents/`);
  },

  async updateNgoVerification(ngoId, status) {
    return apiPatch(`/v1/admin/ngos/${ngoId}/verification/`, { status });
  },

  async updateNgoScore(ngoId, score) {
    return apiPatch(`/v1/admin/ngos/${ngoId}/score/`, { score });
  },

  async validateNgo(ngoId) {
    return apiPost(`/v1/admin/ngos/${ngoId}/validate/`);
  },

  async deleteNgo(ngoId) {
    return apiDelete(`/v1/admin/ngos/${ngoId}/`);
  },

  async listCampaigns() {
    return apiGet('/v1/admin/campaigns/');
  },

  async reviewCampaign(campaignId, status) {
    return apiPatch(`/v1/admin/campaigns/${campaignId}/review/`, { status });
  },

  async endCampaign(campaignId) {
    return apiPatch(`/v1/admin/campaigns/${campaignId}/end/`);
  },

  async getScoreCriteria() {
    return apiGet('/v1/admin/score-criteria/');
  },

  async listBundles() {
    return apiGet('/v1/admin/bundles/');
  },

  async createBundle(payload) {
    return apiPost('/v1/admin/bundles/create/', payload);
  },

  async updateBundle(bundleId, payload) {
    return apiPatch(`/v1/admin/bundles/${bundleId}/`, payload);
  },

  async addNgoToBundle(bundleId, ngoId) {
    return apiPost(`/v1/admin/bundles/${bundleId}/ngos/`, { ngoId });
  },

  async removeNgoFromBundle(bundleId, ngoId) {
    return apiDelete(`/v1/admin/bundles/${bundleId}/ngos/${ngoId}/`);
  },

  async endBundle(bundleId) {
    return apiPatch(`/v1/admin/bundles/${bundleId}/end/`);
  },
};
