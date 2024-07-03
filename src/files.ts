import { minioClient, S3_BUCKET } from "./s3"

export const storeFile = async (file: File) => {
  const filename = (file as File).name

  // TODO: use a stream
  const buffer = Buffer.from(await file.arrayBuffer())

  await minioClient.putObject(S3_BUCKET, filename, buffer)
}

export const readFiles = () => minioClient.listObjectsV2(S3_BUCKET).toArray()
