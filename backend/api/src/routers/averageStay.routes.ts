import { Router } from 'express'
import * as averageStayController from '../controllers/averageStay.controller'

const router = Router()

router.get('/averageStay', averageStayController.getAverageStay)

router.post('/averageStay', averageStayController.postAverageStay)

router.put('/averageStay/:year', averageStayController.putAverageStayByYear)

export default router
