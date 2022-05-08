export type StayByResidencePlaces = {
  residencePlace: string
  averageStay: number
}

export type StayByCanaryIslands = {
  island: string
  averageStay: number
  residencePlaces: StayByResidencePlaces[]
}

export type StayByAccommodations = {
  accommodation: string
  averageStay: number
  residencePlaces: StayByResidencePlaces[]
}

export type AverageStay = {
  year: number
  averageStay: number
  stayByResidencePlaces: StayByResidencePlaces[]
  stayByCanaryIslands: StayByCanaryIslands[]
  stayByAccommodations: StayByAccommodations[]
}
