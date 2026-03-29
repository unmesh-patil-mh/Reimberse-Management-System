import { useState, useEffect, useCallback } from 'react';
import { approvalsAPI } from '@/services/api';

export function useApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await approvalsAPI.getPending();
      setApprovals(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const approve = async (expenseId, comments) => {
    await approvalsAPI.approve(expenseId, { comments: comments || undefined });
    await fetch();
  };

  const reject = async (expenseId, comments) => {
    await approvalsAPI.reject(expenseId, { comments: comments || undefined });
    await fetch();
  };

  return { approvals, loading, error, refetch: fetch, approve, reject };
}
