const http = require('http')
const fs = require('fs')
const path = require('path')

const root = __dirname
const port = Number(process.env.PORT || 5173)
const host = process.env.HOST || '127.0.0.1'
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
}

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store'
  })
  res.end(body)
}

const previewUrl = `http://${host}:${port}/preview/index.html`
const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${host}:${port}`)
  const requested = url.pathname === '/' ? '/preview/index.html' : url.pathname
  const filePath = path.resolve(root, `.${decodeURIComponent(requested)}`)

  if (!filePath.startsWith(root)) {
    send(res, 403, 'Forbidden')
    return
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, 'Not found')
      return
    }
    send(res, 200, data, types[path.extname(filePath).toLowerCase()] || 'application/octet-stream')
  })
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`RateLens preview already running: ${previewUrl}`)
    return
  }

  throw error
})

server.listen(port, host, () => {
  console.log(`RateLens preview: ${previewUrl}`)
})
