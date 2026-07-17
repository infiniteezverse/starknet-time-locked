'use client';

import { motion } from 'framer-motion';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { useStarknetkitConnectModal } from 'starknetkit';

export const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal();

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    const { wallet } = await starknetkitConnectModal();
    if (!wallet) return;
  };

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
            onClick={() => disconnect()}
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
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 hover:from-blue-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg"
          >
            🔗
          </motion.span>
          Connect Wallet
        </motion.button>
      )}
    </motion.div>
  );
};
