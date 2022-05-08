import { Request, Response } from 'express'
import { TouristsAndNacionalitiesModel } from '../models/touristsAndNacionalitiesModel'
import { HttpStatus } from '../utils/HttpStatus'

export const getTouristsAndNacionalities = async (_: Request, res: Response) => {
  try {
    const touristsAndNacionalities = await TouristsAndNacionalitiesModel.find()
    res.status(HttpStatus.OK).send(touristsAndNacionalities)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

export const postTouristsAndNacionalities = async (req: Request, res: Response) => {
  try {
    const year = req.body.year
    const touristsAndNacionalities = await TouristsAndNacionalitiesModel.findOne({ year })
    if (touristsAndNacionalities) {
      return res.status(HttpStatus.CONFLICT).json({
        message: `The year ${year} already exists`,
      })
    }

    const newTouristsAndNacionalities = new TouristsAndNacionalitiesModel(req.body)
    await newTouristsAndNacionalities.save()
    return res.status(HttpStatus.CREATED).send(newTouristsAndNacionalities)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

// actualizar un documento de la base de datos por año
export const putTouristsAndNacionalitiesByYear = async (req: Request, res: Response) => {
  try {
    const year = req.params.year

    if (!year) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Missing year parameter',
      })
    }

    const touristsAndNacionalities = await TouristsAndNacionalitiesModel.findOneAndUpdate(
      { year },
      req.body,
      { new: true }
    )

    if (!touristsAndNacionalities) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: 'Tourists and nacionalities not found',
      })
    }

    return res.status(HttpStatus.OK).send(touristsAndNacionalities)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
