import { createWalletClient, http, Address, createPublicClient } from 'viem'
import { baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { NEURAL_DATA_CONTRACT, NEURAL_DATA_ABI } from './neuralDataRegistry'

/**
 * Server-side wallet client for contract interactions.
 * Uses the deployer private key from .env.local
 *
 * SECURITY: This key should have minimal permissions - only for contract writes
 * during upload operations. Never expose this to client-side code.
 */

function getWalletClient() {
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) {
    throw new Error('PRIVATE_KEY not configured in .env.local')
  }

  const account = privateKeyToAccount(privateKey as Address)

  return createWalletClient({
    account,
    chain: baseSepolia,
    transport: http()
  })
}

function getPublicClient() {
  return createPublicClient({
    chain: baseSepolia,
    transport: http()
  })
}

/**
 * Uploads data CID to the NeuralDataRegistry contract.
 *
 * @param cid - IPFS CID to store on-chain
 * @returns Object containing transaction hash, dataId, and receipt
 */
export async function uploadDataToContract(cid: string): Promise<{
  txHash: `0x${string}`
  dataId: bigint
  receipt: { status: 'success' | 'reverted'; transactionHash: `0x${string}` }
}> {
  const walletClient = getWalletClient()
  const publicClient = getPublicClient()
  const contractAddress = NEURAL_DATA_CONTRACT

  // Encode the contract call
  const callData = {
    address: contractAddress,
    abi: NEURAL_DATA_ABI,
    functionName: 'uploadData',
    args: [cid]
  } as const

  // Simulate the transaction first to catch errors early
  const { request } = await publicClient.simulateContract({
    ...callData,
    account: walletClient.account
  })

  // Send the transaction
  const hash = await walletClient.writeContract(request)

  // Wait for confirmation using public client
  const receipt = await publicClient.waitForTransactionReceipt({ hash })

  if (receipt.status !== 'success') {
    throw new Error('Transaction reverted on chain')
  }

  // Extract dataId from return value (need to decode from receipt or re-call)
  // For now, we'll return the hash and let the client query if needed
  return {
    txHash: hash,
    dataId: BigInt(0), // Would need to decode from logs or return value
    receipt: {
      status: receipt.status,
      transactionHash: hash
    }
  }
}

export type { WalletClient } from 'viem'
