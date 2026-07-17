'use client';

import { useEffect, useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { motion } from 'framer-motion';
import { CountdownTimer } from '@/components/CountdownTimer';
import { StatusBadge } from '@/components/StatusBadge';
import { MetadataCard } from '@/components/MetadataCard';
import { DeadlineInput } from '@/components/DeadlineInput';
import { WalletConnect } from '@/components/WalletConnect';
import { useTimeRegistry } from '@/hooks/useTimeRegistry';

export default function Home() {
  const { isConnected } = useAccount();
  const [totalSeconds, setTotalSeconds] = useState(0);
  const { remainingTime, deadline, isExpired, setDeadline, isWritePending } = useTimeRegistry();

  useEffect(() => {
    if (Number(deadline) > 0) {
      const now = Math.floor(Date.now() / 1000);
      const deadlineNum = Number(deadline);
      setTotalSeconds(deadlineNum - now + remainingTime);
    }
  }, [deadline, remainingTime]);

  const handleSetDeadline = async (days: number, hours: number) => {
    await setDeadline(days, hours);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="text-3xl">⏱️</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Starknet Time-Lock
              </h1>
              <p className="text-xs text-gray-400">Blockchain-Verified Countdown</p>
            </div>
          </motion.div>

          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-[400px]"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-8">
                Connect a Starknet wallet to set and track your deadline
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Countdown & Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Countdown Timer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CountdownTimer remainingSeconds={remainingTime} isExpired={isExpired} />
              </motion.div>

              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <StatusBadge remainingSeconds={remainingTime} isExpired={isExpired} />
              </motion.div>

              {/* Metadata Card */}
              <MetadataCard deadline={deadline} remainingSeconds={remainingTime} totalSeconds={totalSeconds} />
            </div>

            {/* Right Column - Controls */}
            <div className="space-y-6">
              <DeadlineInput onSetDeadline={handleSetDeadline} isLoading={isWritePending} />

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl -z-10" />
                <div className="glass-effect rounded-2xl p-6 backdrop-blur-xl border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 text-white">How It Works</h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex gap-3">
                      <span className="text-green-400 font-bold">1</span>
                      <span>Set your deadline with days and hours</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-green-400 font-bold">2</span>
                      <span>Deadline is verified on-chain via Cairo</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-green-400 font-bold">3</span>
                      <span>Frontend syncs with blockchain every second</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-green-400 font-bold">4</span>
                      <span>Per-user storage keeps all data private</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="relative"
              >
                <div className="glass-effect rounded-2xl p-6 backdrop-blur-xl border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 text-white">Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="font-mono text-blue-400">Starknet Sepolia</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Storage:</span>
                      <span className="font-mono text-purple-400">Per-User Map</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Verification:</span>
                      <span className="font-mono text-green-400">On-Chain</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 backdrop-blur-xl bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-400">
          <p>
            Built with Starknet Cairo • Next.js • Framer Motion •{' '}
            <a href="https://github.com" className="text-blue-400 hover:text-blue-300">
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
