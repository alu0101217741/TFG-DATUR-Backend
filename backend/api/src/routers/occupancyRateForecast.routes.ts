import { Router } from 'express'
import * as occupancyRateForecastController from '../controllers/occupancyRateForecast.controller'

const router = Router()

router.get('/occupancyRateForecast', occupancyRateForecastController.getOccupancyRateForecast)

router.post('/occupancyRateForecast', occupancyRateForecastController.postOccupancyRateForecast)

export default router