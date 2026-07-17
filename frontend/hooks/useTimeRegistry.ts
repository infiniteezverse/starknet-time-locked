import { CONTRACT_ADDRESS, TIME_REGISTRY_ABI } from '@/lib/constants';
import { useState, useEffect } from 'react';

// Demo hook that simulates contract interaction
// In production, replace with actual starknet-react calls
export const useTimeRegistry = (refetch?: boolean) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [deadline, setDeadline] = useState<bigint>(0n);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isWritePending, setIsWritePending] = useState(false);

  // Simulate reading deadline from contract storage
  useEffect(() => {
    // In production: call get_my_deadline from contract
    const storedDeadline = localStorage.getItem('demo_deadline');
    if (storedDeadline) {
      setDeadline(BigInt(storedDeadline));
    }
  }, [refetch]);

  // Update remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (Number(deadline) > 0) {
        const now = Math.floor(Date.now() / 1000);
        const remaining = Math.max(0, Number(deadline) - now);
        setRemainingTime(remaining);
        setIsExpired(remaining === 0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  const handleSetDeadline = async (days: number, hours: number) => {
    try {
      setIsWritePending(true);
      const now = Math.floor(Date.now() / 1000);
      const futureDeadline = now + (days * 86400) + (hours * 3600);

      // Simulate contract call
      // In production: call set_deadline(days, hours) on contract
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setDeadline(BigInt(futureDeadline));
      localStorage.setItem('demo_deadline', futureDeadline.toString());

      setIsWritePending(false);
      console.log(`Set deadline: ${days} days, ${hours} hours (Unix: ${futureDeadline})`);
    } catch (error) {
      console.error('Error setting deadline:', error);
      setIsWritePending(false);
    }
  };

  return {
    remainingTime,
    deadline,
    isExpired,
    isLoading: false,
    isWritePending,
    setDeadline: handleSetDeadline,
    refetch: () => {
      // No-op in demo mode
    },
  };
};
