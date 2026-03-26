import { PinataSDK } from 'pinata-web3'
import { NextRequest, NextResponse } from 'next/server'

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

    return NextResponse.json({
      cid: upload.IpfsHash,
      url: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'}/ipfs/${upload.IpfsHash}`
    })
  } catch (error) {
    console.error('Pinata upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}