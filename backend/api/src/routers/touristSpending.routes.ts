import { Router } from 'express'
import * as touristSpendingController from '../controllers/touristSpending.controller'

const router = Router()

router.get('/touristSpending', touristSpendingController.getTouristSpending)

router.post('/touristSpending', touristSpendingController.postTouristSpending)

export default router
