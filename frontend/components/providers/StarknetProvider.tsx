'use client';

import { StarknetConfig, publicProvider } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';
import { PropsWithChildren } from 'react';
import { useStarknetkitConnectModal } from 'starknetkit';
import { braavos, argent } from 'starknetkit/connectors';

export default function StarknetProvider({ children }: PropsWithChildren) {
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: [braavos(), argent()],
  });

  const connectors = [
    {
      id: 'starknetkit',
      name: 'Starknet Wallets',
      icon: '🔗',
    },
  ];

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={publicProvider()}
      connectors={connectors as any}
    >
      {children}
    </StarknetConfig>
  );
}
