import { useContractRead, useContractWrite } from '@starknet-react/core';
import { CONTRACT_ADDRESS, TIME_REGISTRY_ABI } from '@/lib/constants';
import { useState, useEffect } from 'react';

export const useTimeRegistry = (refetch?: boolean) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [deadline, setDeadline] = useState<bigint>(0n);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const { data: deadlineData, isLoading: isLoadingDeadline, refetch: refetchDeadline } = useContractRead({
    address: CONTRACT_ADDRESS,
    functionName: 'get_my_deadline',
    abi: TIME_REGISTRY_ABI,
    watch: true,
  });

  const { data: remainingTimeData, isLoading: isLoadingRemaining, refetch: refetchRemaining } = useContractRead({
    address: CONTRACT_ADDRESS,
    functionName: 'get_my_remaining_time',
    abi: TIME_REGISTRY_ABI,
    watch: true,
  });

  const { data: isExpiredData, isLoading: isLoadingExpired, refetch: refetchExpired } = useContractRead({
    address: CONTRACT_ADDRESS,
    functionName: 'is_my_deadline_expired',
    abi: TIME_REGISTRY_ABI,
    watch: true,
  });

  const { write: setDeadlineWrite, isPending: isWritePending } = useContractWrite({
    calls: [],
  });

  useEffect(() => {
    if (deadlineData) {
      const deadlineNum = typeof deadlineData === 'bigint' ? deadlineData : BigInt(deadlineData as any);
      setDeadline(deadlineNum);
    }
  }, [deadlineData]);

  useEffect(() => {
    if (remainingTimeData) {
      const remaining = typeof remainingTimeData === 'bigint' ? remainingTimeData : BigInt(remainingTimeData as any);
      setRemainingTime(Number(remaining));
    }
  }, [remainingTimeData]);

  useEffect(() => {
    if (isExpiredData) {
      setIsExpired(Boolean(isExpiredData));
    }
  }, [isExpiredData]);

  useEffect(() => {
    if (refetch) {
      refetchDeadline();
      refetchRemaining();
      refetchExpired();
    }
  }, [refetch, refetchDeadline, refetchRemaining, refetchExpired]);

  const handleSetDeadline = async (days: number, hours: number) => {
    try {
      setDeadlineWrite({
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: 'set_deadline',
        calldata: [days.toString(), hours.toString()],
      });
    } catch (error) {
      console.error('Error setting deadline:', error);
    }
  };

  return {
    remainingTime,
    deadline,
    isExpired,
    isLoading: isLoadingDeadline || isLoadingRemaining || isLoadingExpired,
    isWritePending,
    setDeadline: handleSetDeadline,
    refetch: () => {
      refetchDeadline();
      refetchRemaining();
      refetchExpired();
    },
  };
};
