import { apiGet, apiPost, apiDelete, apiDownload, saveBlob, apiUpload } from './apiClient';
import { ngoService } from './ngoService';

function mapProfile(detail) {
  return {
    id: detail.id,
    name: detail.name,
    logo: detail.logo || '',
    description: detail.description,
    cnpj: detail.cnpj,
    cause: detail.causeLabel || detail.cause,
    city: detail.city,
    state: detail.state,
    location: detail.location,
    website: detail.website || '',
    socialLinks: detail.socialLinks || {},
    yearsOperating: detail.yearsOperating,
    score: detail.score,
    verified: detail.verified,
    lastUpdated: detail.lastUpdated,
    lastExternalAudit: detail.lastExternalAudit || null,
  };
}

function mapCampaign(camp) {
  return {
    id: camp.id,
    title: camp.name ?? camp.title,
    goal: camp.targetAmount ?? camp.goal ?? 0,
    raisedAmount: camp.raisedAmount ?? 0,
    status: camp.status,
    startDate: camp.startDate ?? null,
    endDate: camp.endDate ?? null,
  };
}

function mapChangeHistoryEntry(entry) {
  return {
    id: entry.id,
    field: entry.field,
    oldValue: entry.oldValue ?? '',
    newValue: entry.newValue ?? '',
    date: entry.date ?? entry.changedAt,
    approvedBy: entry.approvedBy ?? entry.changedBy ?? '—',
    reason: entry.reason ?? '',
  };
}

function mapChangeRequest(req) {
  return {
    id: req.id,
    field: req.field_name ?? req.field,
    oldValue: req.old_value ?? req.oldValue ?? '',
    newValue: req.new_value ?? req.newValue ?? '',
    justification: req.reason ?? req.justification ?? '',
    status: req.status,
    createdAt: req.created_at ?? req.createdAt,
    adminResponse: req.admin_response ?? req.adminResponse ?? null,
  };
}

export const transparencyService = {
  async getNGOProfile(id) {
    const detail = await ngoService.getById(id);
    return mapProfile(detail);
  },

  async getVerificationData(id) {
    return ngoService.getVerification(id);
  },

  async getFinancialData(id) {
    return apiGet(`/v1/transparency/ngos/${id}/financial-data/`);
  },

  async getCampaignHistory(id) {
    const campaigns = await ngoService.getNgoCampaigns(id);
    return (campaigns || []).map(mapCampaign);
  },

  async getChangeHistory(id) {
    const history = await apiGet(`/v1/transparency/ngos/${id}/change-history/`);
    return (history || []).map(mapChangeHistoryEntry);
  },

  async getPendingRequests(id) {
    const requests = await apiGet(`/v1/transparency/ngos/${id}/pending-requests/`);
    return (requests || []).map(mapChangeRequest);
  },

  async getChangeRequests(id) {
    const requests = await apiGet(`/v1/transparency/ngos/${id}/change-requests/`);
    return (requests || []).map(mapChangeRequest);
  },

  async listReports(id) {
    return apiGet(`/v1/transparency/ngos/${id}/reports/`);
  },

  async clearReports(id) {
    return apiDelete(`/v1/transparency/ngos/${id}/reports/`);
  },

  async generateReport(id, payload) {
    return apiPost(`/v1/transparency/ngos/${id}/reports/generate/`, payload);
  },

  async downloadReport(ngoId, reportId) {
    return apiDownload(
      `/v1/transparency/ngos/${ngoId}/reports/${reportId}/download/`,
      `relatorio-${reportId.slice(0, 8)}.pdf`,
    );
  },

  async generateAndDownloadReport(ngoId, payload) {
    const result = await apiPost(`/v1/transparency/ngos/${ngoId}/reports/generate/`, payload);
    if (!result?.report?.id) {
      throw new Error('Relatório gerado sem identificador válido.');
    }
    const file = await apiDownload(
      `/v1/transparency/ngos/${ngoId}/reports/${result.report.id}/download/`,
      `relatorio-${result.report.id.slice(0, 8)}.pdf`,
    );
    saveBlob(file.blob, file.filename);
    return result.report;
  },

  async submitChangeRequest(ongId, data) {
    return apiPost(`/v1/transparency/ngos/${ongId}/requests/`, data);
  },

  async approveChangeRequest(id) {
    return apiPost(`/v1/transparency/requests/${id}/approve/`, {});
  },

  async rejectChangeRequest(id) {
    return apiPost(`/v1/transparency/requests/${id}/reject/`, {});
  },

  async getDocuments(id) {
    return apiGet(`/v1/transparency/ngos/${id}/documents/`);
  },

  async uploadDocument(ongId, file, { title, description } = {}) {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    const doc = await apiUpload(`/v1/transparency/ngos/${ongId}/documents/upload/`, formData);
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      documentUrl: doc.documentUrl,
      uploadedAt: doc.uploadedAt,
      isPublic: doc.isPublic,
    };
  },

  async getDataSources(id) {
    return apiGet(`/v1/ngos/${id}/data-sources/`);
  },
};

export async function getAllocationCriteria() {
  return apiGet('/v1/transparency/allocation-criteria/');
}
