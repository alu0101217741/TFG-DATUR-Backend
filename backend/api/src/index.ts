import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import './db/mongoose'
import defaultRouter from './routers/default.routes'
import touristsAndNacionalites from './routers/touristsAndNacionalities.routes'

const app = express()
const port = process.env.PORT || 3000

/**
 * Middlewares
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

/**
 * Routes available in the API.
 */
app.use(touristsAndNacionalites)
app.use(defaultRouter)

/**
 * Start the server.
 */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
