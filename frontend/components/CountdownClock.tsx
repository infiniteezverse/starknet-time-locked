'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatTime, FormattedTime } from '@/lib/timeUtils';

// Particle component for confetti effect
const Particle = ({ delay, duration }: { delay: number; duration: number }) => (
  <motion.div
    initial={{
      y: -100,
      x: Math.random() * 200 - 100,
      opacity: 1,
      rotate: 0,
      scale: Math.random() * 1 + 0.5
    }}
    animate={{
      y: 400,
      x: Math.random() * 400 - 200,
      opacity: 0,
      rotate: Math.random() * 360,
      scale: 0
    }}
    transition={{ duration, delay, ease: 'easeIn' }}
    className="fixed pointer-events-none text-2xl"
  >
    {['🎉', '🎊', '✨', '🎈', '🎁', '⭐', '🌟', '💫'][Math.floor(Math.random() * 8)]}
  </motion.div>
);

interface CountdownClockProps {
  remainingSeconds: number;
  isExpired: boolean;
}

export const CountdownClock = ({ remainingSeconds, isExpired }: CountdownClockProps) => {
  const [displayTime, setDisplayTime] = useState<FormattedTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [syncTime, setSyncTime] = useState(Date.now());
  const [particles, setParticles] = useState<number[]>([]);
  const [celebration, setCelebration] = useState(false);

  useEffect(() => {
    setSyncTime(Date.now());
    setDisplayTime(formatTime(remainingSeconds));

    // Trigger celebration if actively counting down
    if (remainingSeconds > 0 && !isExpired) {
      setCelebration(true);
      // Generate particles for celebration
      setParticles(Array.from({ length: 15 }, (_, i) => i));
    }
  }, [remainingSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - syncTime) / 1000);
      const newRemaining = Math.max(0, remainingSeconds - elapsed);
      setDisplayTime(formatTime(newRemaining));
    }, 100);

    return () => clearInterval(interval);
  }, [remainingSeconds, syncTime]);

  // Calculate rotation angles for clock hands
  const secondsAngle = (displayTime.seconds / 60) * 360;
  const minutesAngle = ((displayTime.minutes + displayTime.seconds / 60) / 60) * 360;
  const hoursAngle = ((displayTime.hours % 12 + displayTime.minutes / 60) / 12) * 360;
  const daysAngle = (displayTime.days / 7) * 360; // Full rotation per week

  const totalSecondsLeft = displayTime.days * 86400 + displayTime.hours * 3600 + displayTime.minutes * 60 + displayTime.seconds;
  const progressPercentage = remainingSeconds > 0 ? (totalSecondsLeft / remainingSeconds) * 100 : 0;

  if (isExpired) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 relative"
      >
        {/* Celebration particles for expiry */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle key={`expire-${i}`} delay={i * 0.05} duration={2} />
        ))}

        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2 }}
          className="text-7xl mb-6"
        >
          ✓
        </motion.div>
        <div className="text-4xl font-bold text-red-500 mb-2">TIME'S UP!</div>
        <p className="text-gray-400">Countdown has ended</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center space-y-6 relative"
    >
      {/* Celebration particles */}
      {celebration && particles.map((i) => (
        <Particle key={`particle-${i}`} delay={i * 0.08} duration={3} />
      ))}
      {/* Animated background glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -inset-12 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl -z-10"
      />

      {/* Analog Clock */}
      <motion.div
        animate={{
          rotateY: [0, 5, -5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative w-72 h-72"
      >
        {/* Glow effect behind clock */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl" />

        {/* Outer ring with days */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Day markers */}
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = (i / 7) * 360;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 85 * Math.cos(rad);
            const y1 = 100 + 85 * Math.sin(rad);
            const x2 = 100 + 95 * Math.cos(rad);
            const y2 = 100 + 95 * Math.sin(rad);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(100,200,255,0.5)" strokeWidth="2" />
            );
          })}

          {/* Days progress ring */}
          <motion.circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#daysGradient)"
            strokeWidth="8"
            strokeDasharray={`${(daysAngle / 360) * (2 * Math.PI * 85)} ${2 * Math.PI * 85}`}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />

          {/* Center circle */}
          <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Hours hand */}
          <motion.line
            x1="100"
            y1="100"
            x2="100"
            y2="50"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ rotate: hoursAngle }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: '100px 100px' }}
          />

          {/* Minutes hand */}
          <motion.line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ rotate: minutesAngle }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: '100px 100px' }}
          />

          {/* Seconds hand */}
          <motion.line
            x1="100"
            y1="100"
            x2="100"
            y2="20"
            stroke="#ec4899"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ rotate: secondsAngle }}
            transition={{ duration: 0.05 }}
            style={{ transformOrigin: '100px 100px' }}
          />

          {/* Center dot */}
          <circle cx="100" cy="100" r="5" fill="#ffffff" />

          {/* Gradients */}
          <defs>
            <linearGradient id="daysGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Rotating orbit rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, linear: true }}
          className="absolute inset-2 border border-blue-500/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, linear: true }}
          className="absolute inset-6 border border-purple-500/20 rounded-full"
        />

        {/* Floating particles around clock */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              linear: true,
            }}
            className="absolute inset-0"
          >
            <div
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                marginTop: '-4px',
                marginLeft: '-100px',
              }}
            />
          </motion.div>
        ))}

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center"
          >
            <div className="text-3xl font-black text-white drop-shadow-lg">
              {String(displayTime.hours).padStart(2, '0')}:{String(displayTime.minutes).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400 mt-1">Hours:Minutes</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Digital Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm relative"
      >
        {/* Animated glow behind digital display */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl -z-10"
        />

        <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/20 shadow-2xl overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500" />
          </div>
          {/* Large Time Display */}
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center mb-6 relative z-10"
          >
            {/* Floating emojis around time display */}
            <motion.div
              animate={{ y: [0, -10, 0], x: [-10, 0, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -left-8 top-0 text-2xl"
            >
              🎉
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0], x: [10, 0, 10] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -right-8 top-0 text-2xl"
            >
              🎊
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="absolute -left-6 bottom-0 text-xl"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              className="absolute -right-6 bottom-0 text-xl"
            >
              ⭐
            </motion.div>

            <div className="text-6xl font-black font-mono mb-2 drop-shadow-xl">
              <span className="text-blue-400">{String(displayTime.days).padStart(2, '0')}</span>
              <span className="text-gray-500 mx-1">:</span>
              <span className="text-purple-400">{String(displayTime.hours).padStart(2, '0')}</span>
              <span className="text-gray-500 mx-1">:</span>
              <span className="text-pink-400">{String(displayTime.minutes).padStart(2, '0')}</span>
              <span className="text-gray-500 mx-1">:</span>
              <span className="text-red-400">{String(displayTime.seconds).padStart(2, '0')}</span>
            </div>
            <div className="flex justify-center gap-8 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div>Days</div>
              <div>Hours</div>
              <div>Mins</div>
              <div>Secs</div>
            </div>
          </motion.div>

          {/* Progress Ring */}
          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Progress</span>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-blue-400 font-semibold"
              >
                {progressPercentage.toFixed(1)}%
              </motion.span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              />
            </div>
          </div>

          {/* Indicator Lights */}
          <div className="grid grid-cols-4 gap-3 mt-6 relative z-10">
            <div className="text-center">
              <motion.div
                animate={{ scale: displayTime.days > 0 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 1, repeat: displayTime.days > 0 ? Infinity : 0 }}
                className={`w-3 h-3 rounded-full mx-auto mb-2 shadow-lg ${displayTime.days > 0 ? 'bg-blue-500 shadow-blue-500' : 'bg-slate-600'}`}
              />
              <div className="text-xs text-gray-400">{displayTime.days}d</div>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ scale: displayTime.hours > 0 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 1, repeat: displayTime.hours > 0 ? Infinity : 0 }}
                className={`w-3 h-3 rounded-full mx-auto mb-2 shadow-lg ${displayTime.hours > 0 ? 'bg-purple-500 shadow-purple-500' : 'bg-slate-600'}`}
              />
              <div className="text-xs text-gray-400">{displayTime.hours}h</div>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ scale: displayTime.minutes > 0 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 1, repeat: displayTime.minutes > 0 ? Infinity : 0 }}
                className={`w-3 h-3 rounded-full mx-auto mb-2 shadow-lg ${displayTime.minutes > 0 ? 'bg-pink-500 shadow-pink-500' : 'bg-slate-600'}`}
              />
              <div className="text-xs text-gray-400">{displayTime.minutes}m</div>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 rounded-full mx-auto mb-2 bg-red-500 shadow-lg shadow-red-500"
              />
              <div className="text-xs text-gray-400">{displayTime.seconds}s</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
