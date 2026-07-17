'use client';

import { PropsWithChildren } from 'react';

// Simplified provider - removes StarknetConfig wrapper temporarily
// The app works in demo mode and is ready for Starknet integration
export default function StarknetProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
