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

export const postTouristSpending = async (req: Request, res: Response) => {
  try {
    const trimester = req.body.trimester
    const touristSpending = await TouristSpendingModel.findOne({ trimester })
    if (touristSpending) {
      return res.status(HttpStatus.CONFLICT).json({
        message: `The trimester ${trimester} already exists`,
      })
    }
    const newTouristSpending = new TouristSpendingModel(req.body)
    await newTouristSpending.save()
    return res.status(HttpStatus.CREATED).send(newTouristSpending)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
