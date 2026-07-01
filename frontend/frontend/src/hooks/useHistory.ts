import { useCallback, useEffect, useState } from "react";

import { getErrorMessage, getHistory } from "../services/api";
import type { Analysis } from "../types/analysis";

export function useHistory() {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refetch: fetchHistory };
}
