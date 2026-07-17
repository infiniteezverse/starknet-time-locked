'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    // Demo: simulate wallet connection
    const demoAddress = '0x' + Array(63).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setAddress(demoAddress);
    setIsConnected(true);
    localStorage.setItem('demo_connected', 'true');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
    localStorage.setItem('demo_connected', 'false');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3"
    >
      {isConnected && address ? (
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-300">
            Connected: <span className="font-mono font-semibold text-white">{formatAddress(address)}</span>
          </div>
          <motion.button
            onClick={handleDisconnect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-200 text-sm"
          >
            Disconnect
          </motion.button>
        </div>
      ) : (
        <motion.button
          onClick={handleConnect}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          <span className="text-lg">🔗</span>
          Connect Wallet (Demo)
        </motion.button>
      )}
    </motion.div>
  );
};
