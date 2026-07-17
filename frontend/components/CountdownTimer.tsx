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

  const getStatusColor = () => {
    if (isExpired) return 'text-red-500';
    if (remainingSeconds < 3600) return 'text-yellow-500';
    return 'text-green-500';
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      key={`${label}-${value}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <div className="text-5xl md:text-7xl font-bold font-mono mb-2">{String(value).padStart(2, '0')}</div>
      <div className="text-xs md:text-sm font-semibold text-gray-400 uppercase">{label}</div>
    </motion.div>
  );

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10" />
      <div className="glass-effect rounded-3xl p-8 md:p-12 backdrop-blur-xl border border-white/10">
        {isExpired ? (
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-bold text-red-500 mb-4">EXPIRED</div>
            <p className="text-gray-400">This countdown has ended</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 md:gap-6">
            <TimeUnit value={displayTime.days} label="Days" />
            <TimeUnit value={displayTime.hours} label="Hours" />
            <TimeUnit value={displayTime.minutes} label="Mins" />
            <TimeUnit value={displayTime.seconds} label="Secs" />
          </div>
        )}

        {/* Animated Ring */}
        {!isExpired && (
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                opacity="0.5"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
