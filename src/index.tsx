// This file is the Hono backend entry point
// The React SPA is served from index.html via Vite
// In production, Cloudflare Pages serves index.html and assets
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/api/*', cors())

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', app: 'Libra Library', timestamp: new Date().toISOString() })
})

export default app
