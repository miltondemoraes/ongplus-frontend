import { apiGet, apiPatch } from './apiClient';

export const donorProfileService = {
  async getProfile() {
    return apiGet('/v1/donors/profile/');
  },

  async listDonations() {
    return apiGet('/v1/donors/donations/');
  },

  async listCausePreferences() {
    return apiGet('/v1/donors/cause-preferences/');
  },

  async updateCausePreferences(causePreferences) {
    return apiPatch('/v1/donors/cause-preferences/', { causePreferences });
  },
};
