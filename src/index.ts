import { Hono } from "hono"
import { cors } from "hono/cors"
import { minioClient, S3_BUCKET } from "./s3"
import { readFiles, storeFile } from "./files"

const app = new Hono()

app.use(cors())

app.post("/files", async (c) => {
  const { file } = await c.req.parseBody()

  await storeFile(file as File)

  return c.json({ filename: (file as File).name })
})

app.get("/files", async (c) => {
  const files = await readFiles()
  return c.json({ files })
})

app.get("/files/:key", async (c) => {
  // TODO: this is most likely not the right way
  const { key } = c.req.param()
  const stream = await minioClient.getObject(S3_BUCKET, key)

  const readableStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => {
        controller.enqueue(chunk)
      })
      stream.on("end", () => {
        controller.close()
      })
      stream.on("error", (err) => {
        controller.error(err)
      })
    },
  })

  return c.newResponse(readableStream)
})

export default {
  port: 3000,
  host: "0.0.0.0",
  fetch: app.fetch,
}
