import { apiGet } from './apiClient';
import { getAllocationCriteria as fetchAllocationCriteria } from './transparencyService';

export const globalTransparencyService = {
  async getGlobalMetrics() {
    return apiGet('/v1/transparency/global-metrics/');
  },

  async getRecentTransfers() {
    return apiGet('/v1/transparency/recent-transfers/');
  },

  async getAllocationCriteria() {
    return await fetchAllocationCriteria();
  },
};
