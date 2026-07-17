'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    setIsLoading(true);
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate demo address
    const demoAddress = '0x' + Array(63).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setAddress(demoAddress);
    setIsConnected(true);
    localStorage.setItem('wallet_connected', 'true');
    localStorage.setItem('wallet_address', demoAddress);

    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event('storage'));
    // Also trigger a custom event
    window.dispatchEvent(new CustomEvent('walletConnected', { detail: { address: demoAddress } }));

    setIsLoading(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
    localStorage.setItem('wallet_connected', 'false');
    localStorage.removeItem('wallet_address');

    // Trigger disconnect event
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
  };

  // Check if wallet was previously connected
  const loadConnectionState = () => {
    if (typeof window !== 'undefined') {
      const wasConnected = localStorage.getItem('wallet_connected') === 'true';
      const savedAddress = localStorage.getItem('wallet_address');
      if (wasConnected && savedAddress) {
        setIsConnected(true);
        setAddress(savedAddress);
      }
    }
  };

  // Load state on mount
  if (typeof window !== 'undefined' && !isConnected && !address) {
    loadConnectionState();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center gap-3"
    >
      {isConnected && address ? (
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <div className="text-sm text-gray-200">
            <span className="text-green-400 font-semibold">Connected:</span>
            <span className="font-mono ml-2 text-white">{formatAddress(address)}</span>
          </div>
          <motion.button
            onClick={handleDisconnect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-2 px-3 py-1 bg-red-500/30 hover:bg-red-500/50 text-red-300 text-xs font-semibold rounded-lg transition-all duration-200"
          >
            Disconnect
          </motion.button>
        </div>
      ) : (
        <motion.button
          onClick={handleConnect}
          disabled={isLoading}
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 hover:from-blue-600 hover:via-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg"
          >
            {isLoading ? '⏳' : '🔗'}
          </motion.span>
          {isLoading ? 'Connecting...' : 'Connect Wallet (Demo)'}
        </motion.button>
      )}
    </motion.div>
  );
};
