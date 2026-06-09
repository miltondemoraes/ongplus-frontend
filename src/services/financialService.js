import { apiGet, apiPost } from './apiClient';

export const financialService = {
  async listPaymentMethods() {
    return apiGet('/v1/financial/payment-methods/');
  },

  async createDonation(payload) {
    return apiPost('/v1/financial/donations/', payload);
  },

  async processDonation(donationId) {
    return apiPost(`/v1/financial/donations/${donationId}/process/`, {});
  },

  async listMyDonations() {
    return apiGet('/v1/financial/donations/my_donations/');
  },
};
