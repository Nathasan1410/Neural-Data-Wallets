import { Address } from 'viem'

export const NEURAL_DATA_CONTRACT = '0x2700C2B1268B115cF06136b881341903aBC7DC4a' as Address

export const NEURAL_DATA_ABI = [
  {
    type: 'function' as const,
    name: 'uploadData',
    inputs: [{ name: 'cid', type: 'string' as const }],
    outputs: [{ name: 'dataId', type: 'uint256' as const }],
    stateMutability: 'nonpayable' as const
  },
  {
    type: 'function' as const,
    name: 'grantAccess',
    inputs: [{ name: 'researcher', type: 'address' as const }],
    outputs: [],
    stateMutability: 'nonpayable' as const
  },
  {
    type: 'function' as const,
    name: 'revokeAccess',
    inputs: [{ name: 'researcher', type: 'address' as const }],
    outputs: [],
    stateMutability: 'nonpayable' as const
  },
  {
    type: 'function' as const,
    name: 'hasAccess',
    inputs: [
      { name: 'user', type: 'address' as const },
      { name: 'researcher', type: 'address' as const }
    ],
    outputs: [{ name: '', type: 'bool' as const }],
    stateMutability: 'view' as const
  },
  {
    type: 'function' as const,
    name: 'getData',
    inputs: [{ name: 'dataId', type: 'uint256' as const }],
    outputs: [{
      type: 'tuple' as const,
      components: [
        { name: 'cid', type: 'string' as const },
        { name: 'timestamp', type: 'uint256' as const },
        { name: 'metadata', type: 'bytes' as const }
      ]
    }],
    stateMutability: 'view' as const
  },
  {
    type: 'function' as const,
    name: 'getDataCount',
    inputs: [{ name: 'owner', type: 'address' as const }],
    outputs: [{ name: '', type: 'uint256' as const }],
    stateMutability: 'view' as const
  },
  {
    type: 'function' as const,
    name: 'getDataIdsByOwner',
    inputs: [{ name: 'owner', type: 'address' as const }],
    outputs: [{ name: '', type: 'uint256[]' as const }],
    stateMutability: 'view' as const
  },
  {
    type: 'function' as const,
    name: 'getAllAccessibleData',
    inputs: [{ name: 'researcher', type: 'address' as const }],
    outputs: [
      { name: 'dataIds', type: 'uint256[]' as const },
      {
        name: 'dataList',
        type: 'tuple[]' as const,
        components: [
          { name: 'cid', type: 'string' as const },
          { name: 'timestamp', type: 'uint256' as const },
          { name: 'metadata', type: 'bytes' as const }
        ]
      }
    ],
    stateMutability: 'view' as const
  },
  {
    type: 'function' as const,
    name: 'getDataByOwnerPaginated',
    inputs: [
      { name: 'owner', type: 'address' as const },
      { name: 'offset', type: 'uint256' as const },
      { name: 'limit', type: 'uint256' as const }
    ],
    outputs: [{
      type: 'tuple[]' as const,
      components: [
        { name: 'cid', type: 'string' as const },
        { name: 'timestamp', type: 'uint256' as const },
        { name: 'metadata', type: 'bytes' as const }
      ]
    }],
    stateMutability: 'view' as const
  },
  {
    type: 'function' as const,
    name: 'hasAccessToData',
    inputs: [
      { name: 'user', type: 'address' as const },
      { name: 'researcher', type: 'address' as const }
    ],
    outputs: [{ name: '', type: 'bool' as const }],
    stateMutability: 'view' as const
  },
  {
    type: 'event' as const,
    name: 'DataRegistered',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'cid', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event' as const,
    name: 'AccessGranted',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'researcher', type: 'address', indexed: true }
    ]
  },
  {
    type: 'event' as const,
    name: 'AccessRevoked',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'researcher', type: 'address', indexed: true }
    ]
  }
] as const

export type NeuralDataRegistryABI = typeof NEURAL_DATA_ABI