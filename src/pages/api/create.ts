import type { NextApiRequest, NextApiResponse } from 'next'
import { SkinProcessor } from '@/lib/skin-processor';

export interface CreateSkinInfoRequest {
    skin: string;
    name: string;
    author: string;
    content: string;
}

export interface CreateSkinInfoResponse {
    skin: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CreateSkinInfoResponse>) {
    const skinInfo = req.body as CreateSkinInfoRequest
    const prosessor = new SkinProcessor()
    await prosessor.init()
    const encodedSkin = await prosessor.encodeJson(skinInfo.skin, {
        name: skinInfo.name,
        author: skinInfo.author,
        content: skinInfo.content,
    })
    res.status(200).json({
        skin: encodedSkin,
    })
}