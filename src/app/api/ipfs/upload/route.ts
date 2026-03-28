import { PinataSDK } from 'pinata-web3'
import { NextRequest, NextResponse } from 'next/server'
import { uploadDataToContract } from '@/lib/contracts/serverSigner'

export async function POST(request: NextRequest) {
  try {
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'
    })

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const upload = await pinata.upload.file(file) as unknown as { IpfsHash: string }
    const cid = upload.IpfsHash

    // Write CID to smart contract
    let txHash: string | undefined
    let contractError: string | undefined

    try {
      const result = await uploadDataToContract(cid)
      txHash = result.txHash
    } catch (error) {
      console.error('Contract upload error:', error)
      contractError = error instanceof Error ? error.message : 'Contract write failed'
      // Don't fail the entire request - IPFS upload succeeded
      // But log the error for debugging
    }

    return NextResponse.json({
      cid,
      url: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'}/ipfs/${cid}`,
      txHash,
      contractError
    })
  } catch (error) {
    console.error('Pinata upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

// Note: Contract errors are returned in response but don't fail the request
// This allows IPFS upload to succeed even if contract write fails (e.g., gas issues)