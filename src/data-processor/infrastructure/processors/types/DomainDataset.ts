import { BusinessProgressExpectation } from '../../../domain/business-progress-expectation/BusinessProgressExpectation'
import { OccupancyRateForecast } from '../../../domain/occupancy-rate-forecast/OccupancyRateForecast'
import { TouristSpending } from '../../../domain/tourist-spending/TouristSpending'
import { TouristStay } from '../../../domain/tourist-stay/TouristStay'
import { TouristsNumber } from '../../../domain/tourists-number/TouristsNumber'

export type DomainDataset =
  | TouristSpending
  | OccupancyRateForecast
  | TouristStay
  | BusinessProgressExpectation
  | TouristsNumber
