// Starknet contract addresses and configuration
// Update CONTRACT_ADDRESS after deployment to testnet

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0'; // Will be set after deployment
export const NETWORK = 'SN_SEPOLIA'; // Starknet Sepolia testnet

export const TIME_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'set_deadline',
    inputs: [
      { name: 'days', type: 'core::integer::u64' },
      { name: 'hours', type: 'core::integer::u64' },
    ],
    outputs: [],
    state_mutability: 'external',
  },
  {
    type: 'function',
    name: 'get_my_deadline',
    inputs: [],
    outputs: [{ type: 'core::integer::u64' }],
    state_mutability: 'view',
  },
  {
    type: 'function',
    name: 'get_my_remaining_time',
    inputs: [],
    outputs: [{ type: 'core::integer::u64' }],
    state_mutability: 'view',
  },
  {
    type: 'function',
    name: 'is_my_deadline_expired',
    inputs: [],
    outputs: [{ type: 'core::felt252' }],
    state_mutability: 'view',
  },
] as const;

// Time constants
export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = 3600;
export const SECONDS_IN_DAY = 86400;
