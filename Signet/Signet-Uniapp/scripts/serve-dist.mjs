import { createReadStream, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const port = Number(process.argv[2] || 5192)
const types = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.svg': 'image/svg+xml'
}

createServer((req, res) => {
	const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
	const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
	let filePath = join(root, safePath)
	if (!existsSync(filePath) || urlPath === '/') filePath = join(root, 'index.html')
	res.setHeader('Content-Type', types[extname(filePath)] || 'application/octet-stream')
	createReadStream(filePath).on('error', () => {
		res.statusCode = 404
		res.end('Not found')
	}).pipe(res)
}).listen(port, '0.0.0.0', () => {
	console.log(`serving ${root} at http://localhost:${port}/`)
})
