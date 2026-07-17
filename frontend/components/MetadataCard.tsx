'use client';

import { motion } from 'framer-motion';
import { formatDeadlineDate } from '@/lib/timeUtils';

interface MetadataCardProps {
  deadline: bigint;
  remainingSeconds: number;
  totalSeconds?: number;
}

export const MetadataCard = ({ deadline, remainingSeconds, totalSeconds }: MetadataCardProps) => {
  const progressPercentage = totalSeconds ? Math.max(0, Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100)) : 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl -z-10" />
      <div className="glass-effect rounded-2xl p-6 md:p-8 backdrop-blur-xl border border-white/10">
        <h3 className="text-lg font-semibold mb-6 text-white">Deadline Details</h3>

        <div className="space-y-4">
          {/* Deadline Timestamp */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase">Deadline</label>
            <div className="bg-black/20 rounded-lg p-3 font-mono text-sm text-white">
              {formatDeadlineDate(Number(deadline))}
            </div>
            <div className="text-xs text-gray-500">Unix: {deadline.toString()}</div>
          </div>

          {/* Progress Bar */}
          {totalSeconds && totalSeconds > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-400 uppercase">Progress</label>
                <span className="text-xs font-semibold text-blue-400">{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                />
              </div>
            </div>
          )}

          {/* Contract Address */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <label className="text-xs font-semibold text-gray-400 uppercase">Contract Address</label>
            <div className="bg-black/20 rounded-lg p-3 font-mono text-xs text-white break-all">
              {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
