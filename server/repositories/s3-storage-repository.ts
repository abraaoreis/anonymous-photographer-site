import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { IStorageRepository } from "./interfaces/storage-repository.interface"

export class S3StorageRepository implements IStorageRepository {
    private s3Client: S3Client
    private bucketName: string

    constructor() {
        this.bucketName = process.env.S3_BUCKET_NAME || "photos"
        this.s3Client = new S3Client({
            region: process.env.S3_REGION || "us-east-1",
            endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
            forcePathStyle: true, // Needed for MinIO
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || "minioadmin",
                secretAccessKey: process.env.S3_SECRET_KEY || "minioadmin",
            },
        })
    }

    async upload(name: string, file: File): Promise<string> {
        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`

        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: filename,
                Body: buffer,
                ContentType: file.type,
                ACL: "public-read", // Ensure bucket policy allows this or it's public by default
            })

            await this.s3Client.send(command)

            // Construct public URL
            const endpoint = process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:9000/photos"
            return `${endpoint}/${filename}`
        } catch (error) {
            console.error("Error uploading to S3/MinIO:", error)
            throw new Error(`Failed to upload to storage: ${error instanceof Error ? error.message : String(error)}`)
        }
    }
}
