import express from 'express'
import { createGnssRouter } from './routes/gnss.js'
import { GnssModel } from './models/gnss.js'

const app = express()

const gnssModelInstance = new GnssModel()

app.use('/api/gnss', createGnssRouter({ gnssModel: gnssModelInstance }))

export default app
