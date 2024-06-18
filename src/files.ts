import { BucketItem, BucketStream } from "minio"
import { minioClient, S3_BUCKET} from "./s3"

export const readStream = (dataStream: BucketStream<BucketItem>): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const buffer: any[] = []
    dataStream.on("data", (chunk) => {
      buffer.push(chunk)
    })
    dataStream.on("end", () => {
      resolve(buffer)
    })
    dataStream.on("error", (err) => {
      reject(err)
    })
  })


export const storeFile = async (file: File) => {

  const filename = (file as File).name

  // TODO: use a stream
  const buffer = Buffer.from( await file.arrayBuffer())

  await minioClient.putObject(S3_BUCKET, filename, buffer)
}

export const readFiles = () => minioClient.listObjectsV2(S3_BUCKET).toArray()


