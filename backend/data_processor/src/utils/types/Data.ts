import { AverageStay } from './AverageStay'
import { BusinessProgressExpectation } from './BusinessProgressExpectation'
import { OccupancyRateForecast } from './OccupancyRateForecast'
import { TouristsAndNacionalities } from './TouristsAndNacionalities'
import { TouristSpending } from './TouristSpending'

export type Data =
  | TouristsAndNacionalities
  | AverageStay
  | TouristSpending
  | OccupancyRateForecast
  | BusinessProgressExpectation
