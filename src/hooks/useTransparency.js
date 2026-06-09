import { useState, useEffect, useCallback } from 'react';
import { transparencyService } from '../services/transparencyService';

export function useTransparency(ongId) {
  const [data, setData] = useState({
    profile: null,
    verification: null,
    financial: null,
    campaigns: [],
    changeHistory: [],
    pendingRequests: [],
    documents: [],
    dataSources: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!ongId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const [
        profile,
        verification,
        financial,
        campaigns,
        changeHistory,
        pendingRequests,
        documents,
        dataSources
      ] = await Promise.all([
        transparencyService.getNGOProfile(ongId),
        transparencyService.getVerificationData(ongId),
        transparencyService.getFinancialData(ongId),
        transparencyService.getCampaignHistory(ongId),
        transparencyService.getChangeHistory(ongId),
        transparencyService.getPendingRequests(ongId),
        transparencyService.getDocuments(ongId),
        transparencyService.getDataSources(ongId)
      ]);

      setData({
        profile,
        verification,
        financial,
        campaigns,
        changeHistory,
        pendingRequests,
        documents,
        dataSources
      });
    } catch (err) {
      console.error("Failed to load transparency data:", err);
      setError('Não foi possível carregar os dados de transparência. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [ongId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const submitChangeRequest = async (formData) => {
    try {
      await transparencyService.submitChangeRequest(ongId, {
        field_name: formData.field,
        new_value: formData.newValue,
        reason: formData.justification,
        old_value: formData.oldValue || '',
      });
      await loadData();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Erro ao enviar solicitação' };
    }
  };

  const approveRequest = async (requestId) => {
    try {
      await transparencyService.approveChangeRequest(requestId);
      await loadData(); // Refresh data
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Erro ao aprovar' };
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await transparencyService.rejectChangeRequest(requestId);
      await loadData(); // Refresh data
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Erro ao rejeitar' };
    }
  };

  return {
    data,
    loading,
    error,
    reload: loadData,
    submitChangeRequest,
    approveRequest,
    rejectRequest
  };
}
