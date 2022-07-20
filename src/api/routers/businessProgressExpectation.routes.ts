import { Router } from 'express'
import * as businessProgressExpectationController from '../controllers/businessProgressExpectation.controller'

const router = Router()

router.get(
  '/api/v1/businessProgressExpectation',
  businessProgressExpectationController.getBusinessProgressExpectation
)

router.post(
  '/businessProgressExpectation',
  businessProgressExpectationController.postBusinessProgressExpectation
)

export default router
