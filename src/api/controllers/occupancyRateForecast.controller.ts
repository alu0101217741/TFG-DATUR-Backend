import { Request, Response } from 'express'
import { OccupancyRateForecastModel } from '../models/occupancyRateForecastModel'
import { HttpStatus } from '../utils/HttpStatus'

export const getOccupancyRateForecast = async (_: Request, res: Response) => {
  try {
    const occupancyRateForecast = await OccupancyRateForecastModel.find()
    res.status(HttpStatus.OK).send(occupancyRateForecast)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
