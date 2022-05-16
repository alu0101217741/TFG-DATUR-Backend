import { Request, Response } from 'express'
import { OccupancyRateForecastModel } from '../models/occupancyRateForecast'
import { HttpStatus } from '../utils/HttpStatus'

export const getOccupancyRateForecast = async (_: Request, res: Response) => {
  try {
    const occupancyRateForecast = await OccupancyRateForecastModel.find()
    res.status(HttpStatus.OK).send(occupancyRateForecast)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

export const postOccupancyRateForecast = async (req: Request, res: Response) => {
  try {
    const trimester = req.body.trimester
    const occupancyRateForecast = await OccupancyRateForecastModel.findOne({ trimester })
    if (occupancyRateForecast) {
      return res.status(HttpStatus.CONFLICT).json({
        message: `The trimester ${trimester} already exists`,
      })
    }
    const newOccupancyRateForecast = new OccupancyRateForecastModel(req.body)
    await newOccupancyRateForecast.save()
    return res.status(HttpStatus.CREATED).send(newOccupancyRateForecast)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
