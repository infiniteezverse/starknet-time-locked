'use client';

import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { motion } from 'framer-motion';

export const WalletConnect = () => {
  const { account, address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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
            onClick={() => disconnect()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-200 text-sm"
          >
            Disconnect
          </motion.button>
        </div>
      ) : (
        <div className="flex gap-3">
          {connectors.map((connector) => (
            <motion.button
              key={connector.id}
              onClick={() => connect({ connector })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-lg">🔗</span>
              {connector.name}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};
