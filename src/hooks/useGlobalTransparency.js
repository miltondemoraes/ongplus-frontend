import { useState, useEffect, useCallback } from 'react';
import { globalTransparencyService } from '../services/globalTransparencyService';

export function useGlobalTransparency() {
  const [metrics, setMetrics] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [m, t, c] = await Promise.all([
        globalTransparencyService.getGlobalMetrics(),
        globalTransparencyService.getRecentTransfers(),
        globalTransparencyService.getAllocationCriteria(),
      ]);
      setMetrics(m);
      setTransfers(t);
      setCriteria(c);
    } catch (e) {
      setError('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { metrics, transfers, criteria, loading, error, reload: load };
}
