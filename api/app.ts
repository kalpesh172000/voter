import express from 'express'
import errorHandler from './middlewares/errorHandler.ts'
import corsMiddleware from './middlewares/corsMiddleware.js'
import voteRoutes from './routes/voteRoutes.ts'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(corsMiddleware)

app.use(express.json())

app.use('/api/vote', voteRoutes)

app.use(errorHandler)

export default app
