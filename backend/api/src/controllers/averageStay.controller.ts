import { Request, Response } from 'express'
import { AverageStayModel } from '../models/averageStayModel'
import { HttpStatus } from '../utils/HttpStatus'

export const getAverageStay = async (_: Request, res: Response) => {
  try {
    const averageStay = await AverageStayModel.find()
    res.status(HttpStatus.OK).send(averageStay)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

export const postAverageStay = async (req: Request, res: Response) => {
  try {
    const year = req.body.year
    const averageStay = await AverageStayModel.findOne({ year })
    if (averageStay) {
      return res.status(HttpStatus.CONFLICT).json({
        message: `The year ${year} already exists`,
      })
    }

    const newAverageStay = new AverageStayModel(req.body)
    await newAverageStay.save()
    return res.status(HttpStatus.CREATED).send(newAverageStay)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

export const putAverageStayByYear = async (req: Request, res: Response) => {
  try {
    const year = req.params.year

    if (!year) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Missing year parameter',
      })
    }

    const averageStay = await AverageStayModel.findOneAndUpdate({ year }, req.body, { new: true })

    if (!averageStay) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: 'Average stay not found',
      })
    }

    return res.status(HttpStatus.OK).send(averageStay)
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
