import { Router } from 'express'
import * as occupancyRateForecastController from '../controllers/occupancyRateForecast.controller'

const router = Router()

router.get(
  '/api/v1/occupancyRateForecast',
  occupancyRateForecastController.getOccupancyRateForecast
)

export default router
