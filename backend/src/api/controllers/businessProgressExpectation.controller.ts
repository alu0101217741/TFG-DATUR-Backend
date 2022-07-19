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

export const postBusinessProgressExpectation = async (req: Request, res: Response) => {
  try {
    const trimester = req.body.trimester
    const businessProgressExpectation = await BusinessProgressExpectationModel.findOne({
      trimester,
    })
    if (businessProgressExpectation) {
      return res.status(HttpStatus.CONFLICT).json({
        message: `The trimester ${trimester} already exists`,
      })
    }
    const newBusinessProgressExpectation = new BusinessProgressExpectationModel(req.body)
    await newBusinessProgressExpectation.save()
    return res.status(HttpStatus.CREATED).send(newBusinessProgressExpectation)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
