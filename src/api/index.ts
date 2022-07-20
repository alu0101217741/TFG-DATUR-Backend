import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import './db/dbConnection'
import businessProgressExpectation from './routers/businessProgressExpectation.routes'
import defaultRouter from './routers/default.routes'
import occupancyRateForecast from './routers/occupancyRateForecast.routes'
import touristsAndNacionalites from './routers/touristsAndNacionalities.routes'
import touristSpending from './routers/touristSpending.routes'
import touristStay from './routers/touristStay.routes'

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
app.use(touristStay)
app.use(touristSpending)
app.use(occupancyRateForecast)
app.use(businessProgressExpectation)
app.use(defaultRouter)

/**
 * Start the server.
 */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
