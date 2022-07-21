import { Router } from 'express'
import * as touristSpendingController from '../controllers/touristSpending.controller'

const router = Router()

router.get('/api/v1/touristSpending', touristSpendingController.getTouristSpending)

export default router
