import { Router } from 'express'
import * as touristsAndNacionalitiesController from '../controllers/touristsAndNacionalities.controller'

const router = Router()

// TODO: MIRAR COMO METER PERMISOS O ALGO PARA QUE SOLO PUEDAN HACER EL POST DETERMINADAS PERSONAS
router.post(
  '/numberTouristsAndNacionalites',
  touristsAndNacionalitiesController.postTouristsAndNacionalities
)

router.get(
  '/numberTouristsAndNacionalites',
  touristsAndNacionalitiesController.getTouristsAndNacionalities
)

router.patch(
  '/numberTouristsAndNacionalites/:id',
  touristsAndNacionalitiesController.patchTouristsAndNacionalities
)

router.put(
  '/numberTouristsAndNacionalites/:year',
  touristsAndNacionalitiesController.putTouristsAndNacionalitiesByYear
)

export default router
