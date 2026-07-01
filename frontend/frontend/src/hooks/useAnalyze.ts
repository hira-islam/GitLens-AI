import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { analyzeUser, getErrorMessage } from "../services/api";
import type { Analysis } from "../types/analysis";

export function useAnalyze() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (username: string) => {
      setLoading(true);
      setError(null);

      try {
        const analysis: Analysis = await analyzeUser(username);
        navigate(`/dashboard/${analysis.username}`, { state: { analysis } });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  return { analyze, loading, error, clearError: () => setError(null) };
}
