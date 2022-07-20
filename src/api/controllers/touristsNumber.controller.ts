import { Request, Response } from 'express'
import { TouristsNumberModel } from '../models/touristsNumber'
import { HttpStatus } from '../utils/HttpStatus'

export const getTouristsNumber = async (_: Request, res: Response) => {
  try {
    const touristsAndNacionalities = await TouristsNumberModel.find()
    res.status(HttpStatus.OK).send(touristsAndNacionalities)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
