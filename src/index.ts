import { Hono } from 'hono'
import { cors } from 'hono/cors'

import {minioClient, S3_BUCKET} from './s3'

const app = new Hono()

app.use(cors())

app.post('/upload', async (c) => {
  const {file} = await c.req.parseBody()

  const filename = (file as File).name
  const blob = file.toString()

  await minioClient.putObject(S3_BUCKET, filename, blob)

  return c.json({filename})
})

export default { 
  port: 3000, 
  host: '0.0.0.0',
  fetch: app.fetch, 
} 