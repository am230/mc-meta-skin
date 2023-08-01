import type { NextApiRequest, NextApiResponse } from 'next'
import { SkinProcessor } from '@/lib/skin-processor';

export interface ReadSkinInfoRequest {
    skin: string;
}

export interface ReadSkinInfoResponse {
    name: string;
    author: string;
    content: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ReadSkinInfoResponse>) {
    const skinInfo = req.body as ReadSkinInfoRequest
    const prosessor = new SkinProcessor()
    await prosessor.init()
    const decodedSkin = await prosessor.decodeJson(skinInfo.skin)
    res.status(200).json(decodedSkin)
}