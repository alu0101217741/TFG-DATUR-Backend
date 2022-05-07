export type CountryAndTrimester = {
  country: string
  firtTrimester: number
  secondTrimester: number
  thirdTrimester: number
  fourthTrimester: number
}

export type TouristsByCanaryIslands = {
  island: string
  tourists: number
}

export type TouristsAndNacionalities = {
  year: number
  totalTourists: number
  touristsByCountryAndTrimester: CountryAndTrimester[]
  touristsByCanaryIslands: TouristsByCanaryIslands[]
}
