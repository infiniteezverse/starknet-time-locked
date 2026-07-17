'use client';

import { motion } from 'framer-motion';
import { getStatusInfo } from '@/lib/timeUtils';

interface StatusBadgeProps {
  remainingSeconds: number;
  isExpired: boolean;
}

export const StatusBadge = ({ remainingSeconds, isExpired }: StatusBadgeProps) => {
  const status = getStatusInfo(remainingSeconds, isExpired);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${status.bgColor} ${status.color} px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 w-fit`}
    >
      <motion.span
        animate={status.status === 'active' ? { scale: [1, 1.2, 1] } : { opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {status.icon}
      </motion.span>
      {status.label}
    </motion.div>
  );
};
