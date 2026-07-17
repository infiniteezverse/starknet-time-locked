'use client';

import { StarknetConfig, publicProvider } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';
import { PropsWithChildren } from 'react';

export default function StarknetProvider({ children }: PropsWithChildren) {
  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={publicProvider()}
      connectors={[]}
    >
      {children}
    </StarknetConfig>
  );
}
