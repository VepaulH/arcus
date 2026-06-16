import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import connectRoutes from './routes/connect'
import connectionsRoutes from './routes/connections'
import onboardingRoutes from './routes/onboarding'
import goalsRoutes from './routes/goals'

const app = express()
const PORT = process.env.PORT ?? 3001
const ALLOWED_ORIGINS = (process.env.FRONTEND_URL ?? 'http://localhost:3001')
  .split(',')
  .map(o => o.trim())

const corsOptions = {
  origin: (origin: string | undefined, cb: (e: Error | null, allow?: boolean) => void) =>
    cb(null, !origin || ALLOWED_ORIGINS.includes(origin)),
  credentials: true,
}

app.use(helmet())
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/connect', connectRoutes)
app.use('/api/connections', connectionsRoutes)
app.use('/api/onboarding', onboardingRoutes)
app.use('/api/goals', goalsRoutes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Arcus backend running on http://localhost:${PORT}`)
})