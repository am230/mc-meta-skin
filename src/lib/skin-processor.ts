import { createCanvas, loadImage, Image } from 'canvas'
import { readFile } from 'fs/promises'
import { gzipSync, unzipSync } from 'zlib'

const longToByteArray = (long: number) => {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0]

    for (var index = 0; index < byteArray.length; index++) {
        var byte = long & 0xff
        byteArray[index] = byte
        long = (long - byte) / 256
    }

    return byteArray
}

const byteArrayToLong = function (byteArray: number[]) {
    var value = 0
    for (var i = byteArray.length - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i]
    }

    return value
}


export class SkinProcessor {
    maskImage?: Image
    maskPixels?: Uint8ClampedArray

    async init() {
        this.maskImage = new Image()
        const data = await readFile('public/mask.png')
        this.maskImage.src = data
        const canvas = createCanvas(64, 64)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(this.maskImage, 0, 0)
        const pixels = ctx.getImageData(0, 0, 64, 64)
        this.maskPixels = pixels.data
    }

    async encode(skinData: string, data: number[]): Promise<string> {
        const canvas = createCanvas(64, 64)
        const ctx = canvas.getContext('2d')
        const skinImage = await loadImage(skinData)
        ctx.drawImage(skinImage, 0, 0)

        const overlayImage = ctx.getImageData(0, 0, 64, 64)
        const overlayImageData = overlayImage.data

        const bytes = [...longToByteArray(data.length), ...data]
        let index = 0
        for (let i = 0; i < this.maskPixels!.length; i += 1) {
            if (this.maskPixels![i] < 128) {
                continue
            }
            if (i % 4 == 3) {
                overlayImageData[i] = 255
                continue
            }
            if (index >= bytes.length) {
                continue
            }
            overlayImageData[i] = bytes[index]
            index += 1
        }
        ctx.putImageData(overlayImage, 0, 0)
        const encodedSkin = canvas.toDataURL()
        return encodedSkin
    }

    async decode(skinData: string): Promise<number[]> {
        const canvas = createCanvas(64, 64)
        const ctx = canvas.getContext('2d')
        const skinImage = await loadImage(skinData)
        ctx.drawImage(skinImage, 0, 0)
        const pixels = ctx.getImageData(0, 0, 64, 64)
        let data = []
        let index = 0
        let readLength = 9
        for (let i = 0; i < pixels.data.length; i += 1) {
            if (index >= readLength) {
                break
            }
            if (i % 4 == 3) {
                continue
            }
            if (this.maskPixels![i] < 128) {
                continue
            }
            if (index == 8) {
                readLength = 8 + byteArrayToLong(data)
                data = []
            }
            data.push(pixels.data[i])
            index += 1
        }
        return data
    }

    async encodeJson(skinData: string, data: any): Promise<string> {
        let text = encodeURIComponent(JSON.stringify(data))
        const compressed = gzipSync(text)
        const bytes = Array.from(compressed)
        const encodedSkin = await this.encode(skinData, bytes)
        return encodedSkin
    }

    async decodeJson(skinData: string): Promise<any> {
        const data = await this.decode(skinData)
        const compressed = new Uint8Array(data)
        const text = unzipSync(compressed)
        const decodedData = JSON.parse(decodeURIComponent(text.toString()))
        return decodedData
    }
}