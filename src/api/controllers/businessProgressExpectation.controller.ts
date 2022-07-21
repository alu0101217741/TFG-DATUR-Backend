import { Request, Response } from 'express'
import { BusinessProgressExpectationModel } from '../models/businessProgressExpectationModel'
import { HttpStatus } from '../utils/HttpStatus'

export const getBusinessProgressExpectation = async (_: Request, res: Response) => {
  try {
    const businessProgressExpectation = await BusinessProgressExpectationModel.find()
    res.status(HttpStatus.OK).send(businessProgressExpectation)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
