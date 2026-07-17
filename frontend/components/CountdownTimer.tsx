'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatTime, FormattedTime } from '@/lib/timeUtils';

interface CountdownTimerProps {
  remainingSeconds: number;
  isExpired: boolean;
}

export const CountdownTimer = ({ remainingSeconds, isExpired }: CountdownTimerProps) => {
  const [displayTime, setDisplayTime] = useState<FormattedTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [syncTime, setSyncTime] = useState(Date.now());

  useEffect(() => {
    setSyncTime(Date.now());
    setDisplayTime(formatTime(remainingSeconds));
  }, [remainingSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - syncTime) / 1000);
      const newRemaining = Math.max(0, remainingSeconds - elapsed);
      setDisplayTime(formatTime(newRemaining));
    }, 100);

    return () => clearInterval(interval);
  }, [remainingSeconds, syncTime]);

  const getProgressPercentage = () => {
    if (remainingSeconds <= 0) return 0;
    // Assume 7 days max for initial progress
    const maxSeconds = 7 * 86400;
    return Math.min(100, (remainingSeconds / maxSeconds) * 100);
  };

  const TimeUnit = ({ value, label, index }: { value: number; label: string; index: number }) => (
    <motion.div
      key={`${label}-${value}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center group"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="relative"
      >
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300" />
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-5xl md:text-7xl font-black font-mono mb-3 px-4 py-2 rounded-lg">
          {String(value).padStart(2, '0')}
        </div>
      </motion.div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest"
      >
        {label}
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition duration-500 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10" />
      <div className="glass-effect rounded-3xl p-8 md:p-12 backdrop-blur-2xl border border-white/20">
        {isExpired ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl md:text-8xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-4"
            >
              ✓
            </motion.div>
            <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">EXPIRED</div>
            <p className="text-gray-400 text-lg">This countdown has ended</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8">
              <TimeUnit value={displayTime.days} label="Days" index={0} />
              <TimeUnit value={displayTime.hours} label="Hours" index={1} />
              <TimeUnit value={displayTime.minutes} label="Mins" index={2} />
              <TimeUnit value={displayTime.seconds} label="Secs" index={3} />
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                />
              </div>
            </div>
          </>
        )}

        {/* Animated Glow Border */}
        {!isExpired && (
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl border border-blue-500/30 pointer-events-none"
          />
        )}
      </div>
    </motion.div>
  );
};
