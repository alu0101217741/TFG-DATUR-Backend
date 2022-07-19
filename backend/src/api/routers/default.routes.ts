import * as express from 'express'
import { HttpStatus } from '../utils/HttpStatus'

/**
 * Router object is created that will allow us to define routes.
 */
export const router = express.Router()

/**
 * Checks if the path specified in request is not implemented.
 */
router.all('*', (_, res) => {
  res.status(HttpStatus.NOT_IMPLEMENTED).send()
})

export default router
