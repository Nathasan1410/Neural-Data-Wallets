import { PinataSDK } from 'pinata-web3'

export function getPinataClient() {
  if (!process.env.PINATA_JWT) {
    throw new Error('PINATA_JWT not configured')
  }

  return new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'
  })
}

export const PINATA_GATEWAY = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'}`