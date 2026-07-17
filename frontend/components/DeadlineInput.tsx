'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface DeadlineInputProps {
  onSetDeadline: (days: number, hours: number) => Promise<void>;
  isLoading?: boolean;
}

export const DeadlineInput = ({ onSetDeadline, isLoading = false }: DeadlineInputProps) => {
  const [days, setDays] = useState(1);
  const [hours, setHours] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitted(true);
      await onSetDeadline(days, hours);
      setTimeout(() => setSubmitted(false), 2000);
    } catch (error) {
      console.error('Error:', error);
      setSubmitted(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-2xl blur-xl -z-10" />
      <div className="glass-effect rounded-2xl p-6 md:p-8 backdrop-blur-xl border border-white/10">
        <h3 className="text-lg font-semibold mb-6 text-white">Set Deadline</h3>

        <div className="space-y-6">
          {/* Days Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white">Days</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="365"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                disabled={isLoading}
                className="w-full h-2 bg-black/30 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-2xl font-bold text-blue-400 min-w-[3rem] text-right">{days}</div>
            </div>
          </div>

          {/* Hours Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white">Hours</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                disabled={isLoading}
                className="w-full h-2 bg-black/30 rounded-full appearance-none cursor-pointer accent-purple-500"
              />
              <div className="text-2xl font-bold text-purple-400 min-w-[3rem] text-right">{hours}</div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-black/20 rounded-lg p-4 border border-white/5">
            <p className="text-sm text-gray-300">
              Setting deadline for <span className="font-semibold text-white">{days} days</span> and{' '}
              <span className="font-semibold text-white">{hours} hours</span> from now
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4">
                  ⏳
                </motion.div>
                Setting...
              </>
            ) : submitted ? (
              <>✓ Deadline Set</>
            ) : (
              'Set Deadline'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
