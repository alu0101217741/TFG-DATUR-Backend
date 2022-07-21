import { Router } from 'express'
import * as businessProgressExpectationController from '../controllers/businessProgressExpectation.controller'

const router = Router()

router.get(
  '/api/v1/businessProgressExpectation',
  businessProgressExpectationController.getBusinessProgressExpectation
)

export default router
