import { Router } from 'express'
import * as touristStayController from '../controllers/touristStay.controller'

const router = Router()

router.get('/api/v1/touristStay', touristStayController.getTouristStay)

export default router
