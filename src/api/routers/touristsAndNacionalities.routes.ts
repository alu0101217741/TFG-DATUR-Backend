import { Router } from 'express'
import * as touristsAndNacionalitiesController from '../controllers/touristsNumber.controller'

const router = Router()

router.get('/api/v1/touristsNumber', touristsAndNacionalitiesController.getTouristsNumber)

export default router
