import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import connectRoutes from './routes/connect'
import connectionsRoutes from './routes/connections'

const app = express()
const PORT = process.env.PORT ?? 3001
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3001'

app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/connect', connectRoutes)
app.use('/api/connections', connectionsRoutes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Arcus backend running on http://localhost:${PORT}`)
})