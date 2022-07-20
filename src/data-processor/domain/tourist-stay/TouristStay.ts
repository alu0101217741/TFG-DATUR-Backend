import { AccommodationStay } from './AccommodationStay'
import { IslandStay } from './IslandStay'
import { ResidencePlaceStay, ResidencePlaceStayPrimitives } from './ResidencePlaceStay'
import { Accommodations } from './types/Accommodations'
import { Islands } from './types/Islands'
import { ResidencePlaces } from './types/ResidencePlaces'

export type TouristStayPrimitives = ReturnType<TouristStay['toPrimitives']>

export class TouristStay {
  static fromPrimitives(touristStayPrimitives: TouristStayPrimitives) {
    const stayByResidencePlaces = touristStayPrimitives.stayByResidencePlaces.map(
      (residencePlaceStayPrimitives) =>
        ResidencePlaceStay.fromPrimitives(residencePlaceStayPrimitives)
    )

    const stayByIsland = touristStayPrimitives.stayByIsland.map((islandStayPrimitives) =>
      IslandStay.fromPrimitives(islandStayPrimitives)
    )

    const stayByAccommodations = touristStayPrimitives.stayByAccommodations.map(
      (accommodationStayPrimitives) => AccommodationStay.fromPrimitives(accommodationStayPrimitives)
    )

    return new TouristStay(
      touristStayPrimitives.year,
      touristStayPrimitives.averageStay,
      stayByResidencePlaces,
      stayByIsland,
      stayByAccommodations
    )
  }

  constructor(
    private year: number,
    private averageStay: number,
    private stayByResidencePlaces: ResidencePlaceStay[],
    private stayByIsland: IslandStay[],
    private stayByAccommodations: AccommodationStay[]
  ) {}

  getYear() {
    return this.year
  }

  getStayByIsland() {
    return this.stayByIsland
  }

  findStayByIsland(island: Islands) {
    return this.stayByIsland?.find((islandStay) => islandStay.getIsland() === island)
  }

  findStayByResidencePlace(residencePlace: ResidencePlaces) {
    return this.stayByResidencePlaces?.find((stay) => stay.getResidencePlace() === residencePlace)
  }

  findStayByAccommodation(accommodation: Accommodations) {
    return this.stayByAccommodations?.find((stay) => stay.getAccommodation() === accommodation)
  }

  addStayByResidencePlace(residencePlace: ResidencePlaces, averageStay: number) {
    const stayByResidencePlaces = ResidencePlaceStay.fromPrimitives({
      residencePlace,
      averageStay,
    })
    if (!this.stayByResidencePlaces) {
      this.stayByResidencePlaces = [stayByResidencePlaces]
    } else {
      this.stayByResidencePlaces.push(stayByResidencePlaces)
    }
  }

  addStayByIsland(
    island: Islands,
    averageStay: number,
    islandStayByResidencePlaces?: ResidencePlaceStayPrimitives[]
  ) {
    const stayByIsland = IslandStay.fromPrimitives({
      island,
      averageStay,
      islandStayByResidencePlaces,
    })

    if (!this.stayByIsland) {
      this.stayByIsland = [stayByIsland]
    } else {
      this.stayByIsland.push(stayByIsland)
    }
  }

  addStayByAccommodation(
    accommodation: Accommodations,
    averageStay: number,
    accommodationStayByResidencePlace?: ResidencePlaceStayPrimitives[]
  ) {
    const stayByAccommodation = AccommodationStay.fromPrimitives({
      accommodation,
      averageStay,
      accommodationStayByResidencePlace,
    })

    if (!this.stayByAccommodations) {
      this.stayByAccommodations = [stayByAccommodation]
    } else {
      this.stayByAccommodations.push(stayByAccommodation)
    }
  }

  toPrimitives() {
    return {
      year: this.year,
      averageStay: this.averageStay,
      stayByResidencePlaces: this.stayByResidencePlaces.map((residencePlaceStay) =>
        residencePlaceStay.toPrimitives()
      ),
      stayByIsland: this.stayByIsland.map((islandStay) => islandStay.toPrimitives()),
      stayByAccommodations: this.stayByAccommodations.map((accommodationStay) =>
        accommodationStay.toPrimitives()
      ),
    }
  }
}
