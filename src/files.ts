import { BucketItem, BucketStream } from "minio"
import { minioClient, S3_BUCKET} from "./s3"

const readStream = (dataStream: BucketStream<BucketItem>) =>
  new Promise((resolve, reject) => {
    const buffer: any[] = []
    dataStream.on("data", (chunk: any) => {
      buffer.push(chunk)
    })
    dataStream.on("end", () => {
      resolve(buffer)
    })
    dataStream.on("error", (err: any) => {
      reject(err)
    })
  })


export const storeFile = async (file: File) => {

  const filename = (file as File).name
  const blob = file.toString()

  await minioClient.putObject(S3_BUCKET, filename, blob)
}

export const readFiles = async () => {
  const dataStream = await minioClient.listObjectsV2(S3_BUCKET)
  return await readStream(dataStream)
}