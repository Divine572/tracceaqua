
import { PinataSDK } from "pinata";

const pinataJWT = import.meta.env.VITE_PINATA_JWT
const gatewayUrl = import.meta.env.VITE_PINATA_GATEWAY_URL

if (!pinataJWT) {
  throw new Error('VITE_PINATA_JWT is not set')
}


const pinata = new PinataSDK({
  pinataJwt: pinataJWT,
  pinataGateway: gatewayUrl,
});



export class IPFSService {
  /**
   * Upload file to IPFS via Pinata
   */
  static async uploadFile(file: File): Promise<string> {
    try {
      const result = await pinata.upload.public.file(file)
      return result.cid
    } catch (error) {
      console.error('Error uploading file to IPFS:', error)
      throw new Error('Failed to upload file to IPFS')
    }
  }

  /**
   * Upload JSON data to IPFS
   */
  static async uploadJSON(data: object, name?: string): Promise<string> {
    try {
      const result = await pinata.upload.public.json(data, {
        metadata: {
          name: name || 'TracceAqua Data'
        }
      })
      return result.cid
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error)
      throw new Error('Failed to upload JSON to IPFS')
    }
  }

  /**
   * Get file URL from IPFS hash
   */
  static getFileUrl(cid: string): string {
    return `${gatewayUrl}/ipfs/${cid}`
  }

  /**
   * Upload multiple files
   */
  static async uploadFiles(files: File[]): Promise<string[]> {
    try {
      const uploads = await Promise.all(
        files.map(file => this.uploadFile(file))
      )
      return uploads
    } catch (error) {
      console.error('Error uploading multiple files:', error)
      throw new Error('Failed to upload files')
    }
  }
}