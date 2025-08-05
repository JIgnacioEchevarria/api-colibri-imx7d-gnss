import express from 'express'
import cors from 'cors'
import { createGnssRouter } from './routes/gnss.js'
import { GnssModel } from './models/gnss.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.0.177:5173'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

const gnssModelInstance = new GnssModel()

app.use(express.json())

app.use('/api/gnss', createGnssRouter({ gnssModel: gnssModelInstance }))

export default app
