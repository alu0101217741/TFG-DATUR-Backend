import { Request, Response } from 'express'
import { TouristSpendingModel } from '../models/touristSpendingModel'
import { HttpStatus } from '../utils/HttpStatus'

export const getTouristSpending = async (_: Request, res: Response) => {
  try {
    const touristSpending = await TouristSpendingModel.find()
    res.status(HttpStatus.OK).send(touristSpending)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
