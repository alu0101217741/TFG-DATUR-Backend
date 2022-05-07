import { RequestHandler } from 'express'
import { TouristsAndNacionalities } from '../models/touristsAndNacionalitiesModel'
import { HttpStatus } from '../utils/HttpStatus'

export const postTouristsAndNacionalities: RequestHandler = async (req, res) => {
  try {
    const year = req.body.year
    const touristsAndNacionalities = await TouristsAndNacionalities.findOne({ year })
    if (touristsAndNacionalities) {
      return res.status(HttpStatus.CONFLICT).json({
        message: `The year ${year} already exists`,
      })
    }

    const newTouristsAndNacionalities = new TouristsAndNacionalities(req.body)
    await newTouristsAndNacionalities.save()
    return res.status(HttpStatus.CREATED).send(newTouristsAndNacionalities)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

// Endpoint para buscar en la base de datos por año
export const getTouristsAndNacionalitiesByYear: RequestHandler = async (req, res) => {
  try {
    const year = req.params.year
    const touristsAndNacionalities = await TouristsAndNacionalities.findOne({ year })
    return res.status(HttpStatus.OK).send(touristsAndNacionalities)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

export const getTouristsAndNacionalities: RequestHandler = async (_, res) => {
  try {
    const touristsAndNacionalities = await TouristsAndNacionalities.find()
    res.status(HttpStatus.OK).send(touristsAndNacionalities)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

//search a document in the databse by year
export const getTouristsAndNacionalitiesByYearAndCountry: RequestHandler = async (req, res) => {
  try {
    const year = req.params.year
    const country = req.params.country
    const touristsAndNacionalities = await TouristsAndNacionalities.findOne({ year, country })
    return res.status(HttpStatus.OK).send(touristsAndNacionalities)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

// actualizar un documento de la base de datos por año
export const putTouristsAndNacionalitiesByYear: RequestHandler = async (req, res) => {
  try {
    const year = req.params.year

    if (!year) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Missing year parameter',
      })
    }

    const touristsAndNacionalities = await TouristsAndNacionalities.findOneAndUpdate(
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

export const patchTouristsAndNacionalities: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Missing id parameter',
      })
    }

    const touristsAndNacionalities = await TouristsAndNacionalities.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
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
