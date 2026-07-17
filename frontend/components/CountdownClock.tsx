'use client';

import { useEffect, useState } from 'react';
import { formatTime, FormattedTime } from '@/lib/timeUtils';

interface CountdownClockProps {
  remainingSeconds: number;
  isExpired: boolean;
}

export const CountdownClock = ({ remainingSeconds, isExpired }: CountdownClockProps) => {
  const [displayTime, setDisplayTime] = useState<FormattedTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [syncTime, setSyncTime] = useState(Date.now());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  const secondsAngle = (displayTime.seconds / 60) * 360;
  const minutesAngle = ((displayTime.minutes + displayTime.seconds / 60) / 60) * 360;
  const hoursAngle = ((displayTime.hours % 12 + displayTime.minutes / 60) / 12) * 360;
  const daysAngle = (displayTime.days / 7) * 360;

  const totalSecondsLeft = displayTime.days * 86400 + displayTime.hours * 3600 + displayTime.minutes * 60 + displayTime.seconds;
  const progressPercentage = remainingSeconds > 0 ? (totalSecondsLeft / remainingSeconds) * 100 : 0;

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-7xl mb-6">✓</div>
        <div className="text-4xl font-black text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text mb-2">
          TIME'S UP!
        </div>
        <p className="text-gray-300">Countdown has ended</p>
      </div>
    );
  }

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 relative">
      {/* Vaporwave gradient background */}
      <div className="absolute -inset-20 bg-gradient-to-br from-pink-300/20 via-purple-300/20 to-cyan-300/20 rounded-full blur-3xl -z-10" />

      {/* Analog Clock - Vaporwave Outline */}
      <div className="relative w-80 h-80">
        {/* Outer vaporwave border */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300 via-pink-300 to-purple-300 p-1" style={{boxShadow: '0 0 40px rgba(236, 72, 153, 0.4)'}}>
          {/* Inner clock face */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center border-4 border-purple-400/50 relative">
            {/* Vaporwave clock face design */}
            <svg className="w-full h-full" viewBox="0 0 200 200" style={{filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.3))'}}>
              <defs>
                <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="daysGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Neon circle outline */}
              <circle cx="100" cy="100" r="92" fill="none" stroke="url(#clockGradient)" strokeWidth="2" opacity="0.8" />

              {/* Hour markers - cartoon style */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * 360;
                const rad = (angle * Math.PI) / 180;
                const x1 = 100 + 80 * Math.cos(rad);
                const y1 = 100 + 80 * Math.sin(rad);
                const x2 = 100 + 90 * Math.cos(rad);
                const y2 = 100 + 90 * Math.sin(rad);
                const colors = ['#fbbf24', '#ec4899', '#06b6d4', '#a855f7'];
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={colors[i % 4]}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Days progress ring */}
              <circle
                cx="100"
                cy="100"
                r="75"
                fill="none"
                stroke="url(#daysGradient)"
                strokeWidth="6"
                strokeDasharray={`${(daysAngle / 360) * (2 * Math.PI * 75)} ${2 * Math.PI * 75}`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                filter="drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))"
              />

              {/* Hours hand - neon pink */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="45"
                stroke="#ec4899"
                strokeWidth="6"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${hoursAngle}deg)`,
                  transformOrigin: '100px 100px',
                }}
                filter="drop-shadow(0 0 8px rgba(236, 72, 153, 0.8))"
              />

              {/* Minutes hand - neon purple */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="25"
                stroke="#a855f7"
                strokeWidth="5"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${minutesAngle}deg)`,
                  transformOrigin: '100px 100px',
                }}
                filter="drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))"
              />

              {/* Seconds hand - neon cyan */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="15"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${secondsAngle}deg)`,
                  transformOrigin: '100px 100px',
                }}
                filter="drop-shadow(0 0 6px rgba(6, 182, 212, 0.8))"
              />

              {/* Center dot - vaporwave glow */}
              <circle cx="100" cy="100" r="6" fill="#fbbf24" filter="drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))" />
            </svg>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-black font-mono text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text">
                  {String(displayTime.hours).padStart(2, '0')}:{String(displayTime.minutes).padStart(2, '0')}
                </div>
                <div className="text-xs font-bold text-cyan-300 mt-1 tracking-widest">HOURS:MINS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Display - Vaporwave Cartoon */}
      <div className="w-full max-w-sm relative">
        {/* Vaporwave border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 rounded-3xl" style={{boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)'}} />

        <div className="relative bg-slate-900 rounded-3xl p-8 border-4 border-purple-400/50 overflow-hidden">
          {/* Vaporwave background pattern */}
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-pink-400 to-cyan-400" />

          {/* Large Time Display */}
          <div className="text-center mb-8 relative z-10">
            <div className="text-7xl font-black font-mono mb-3 drop-shadow-xl text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text">
              <span>{String(displayTime.days).padStart(2, '0')}</span>
              <span className="text-purple-300 mx-1">:</span>
              <span>{String(displayTime.hours).padStart(2, '0')}</span>
              <span className="text-pink-300 mx-1">:</span>
              <span>{String(displayTime.minutes).padStart(2, '0')}</span>
              <span className="text-cyan-300 mx-1">:</span>
              <span>{String(displayTime.seconds).padStart(2, '0')}</span>
            </div>
            <div className="flex justify-center gap-6 text-xs font-black text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text uppercase tracking-widest">
              <div>Days</div>
              <div>Hours</div>
              <div>Mins</div>
              <div>Secs</div>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-cyan-300">PROGRESS</span>
              <span className="text-yellow-300 font-black">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border-2 border-purple-400" style={{boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)'}}>
              <div
                style={{ width: `${progressPercentage}%` }}
                className="h-full bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400"
              />
            </div>
          </div>

          {/* Indicator Lights */}
          <div className="grid grid-cols-4 gap-4 mt-8 relative z-10">
            <div className="text-center">
              <div
                className={`w-4 h-4 rounded-full mx-auto mb-2 border-2 ${displayTime.days > 0 ? 'bg-yellow-300 border-yellow-400 shadow-lg shadow-yellow-400' : 'bg-slate-700 border-slate-600'}`}
              />
              <div className="text-xs font-black text-yellow-300">{displayTime.days}D</div>
            </div>
            <div className="text-center">
              <div
                className={`w-4 h-4 rounded-full mx-auto mb-2 border-2 ${displayTime.hours > 0 ? 'bg-pink-400 border-pink-500 shadow-lg shadow-pink-400' : 'bg-slate-700 border-slate-600'}`}
              />
              <div className="text-xs font-black text-pink-300">{displayTime.hours}H</div>
            </div>
            <div className="text-center">
              <div
                className={`w-4 h-4 rounded-full mx-auto mb-2 border-2 ${displayTime.minutes > 0 ? 'bg-purple-400 border-purple-500 shadow-lg shadow-purple-400' : 'bg-slate-700 border-slate-600'}`}
              />
              <div className="text-xs font-black text-purple-300">{displayTime.minutes}M</div>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 rounded-full mx-auto mb-2 border-2 bg-cyan-400 border-cyan-500 shadow-lg shadow-cyan-400" />
              <div className="text-xs font-black text-cyan-300">{displayTime.seconds}S</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
