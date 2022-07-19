import { Request, Response } from 'express'
import { TouristStayModel } from '../models/touristStayModel'
import { HttpStatus } from '../utils/HttpStatus'

export const getTouristStay = async (_: Request, res: Response) => {
  try {
    const touristStay = await TouristStayModel.find()
    res.status(HttpStatus.OK).send(touristStay)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
