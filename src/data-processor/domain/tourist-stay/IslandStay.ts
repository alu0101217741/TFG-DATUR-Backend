import { ResidencePlaceStay } from './ResidencePlaceStay'
import { Islands } from './types/Islands'
import { ResidencePlaces } from './types/ResidencePlaces'

export type IslandStayPrimitives = ReturnType<IslandStay['toPrimitives']>

export class IslandStay {
  static fromPrimitives(islandStayPrimitives: IslandStayPrimitives) {
    const islandStayByResidencePlaces = islandStayPrimitives.islandStayByResidencePlaces
      ? islandStayPrimitives.islandStayByResidencePlaces.map((stay) =>
          ResidencePlaceStay.fromPrimitives(stay)
        )
      : undefined

    return new IslandStay(
      islandStayPrimitives.island,
      islandStayPrimitives.averageStay,
      islandStayByResidencePlaces
    )
  }

  constructor(
    private island: Islands,
    private averageStay: number,
    private islandStayByResidencePlaces?: ResidencePlaceStay[]
  ) {}

  getIsland() {
    return this.island
  }

  findIslandStayByResidencePlace(residencePlace: ResidencePlaces) {
    return this.islandStayByResidencePlaces?.find(
      (islandStay) => islandStay.getResidencePlace() === residencePlace
    )
  }

  addIslandStayByResidencePlaces(residencePlace: ResidencePlaces, averageStay: number) {
    const islandStayByResidencePlaces = ResidencePlaceStay.fromPrimitives({
      residencePlace,
      averageStay,
    })

    if (!this.islandStayByResidencePlaces) {
      this.islandStayByResidencePlaces = [islandStayByResidencePlaces]
    } else {
      this.islandStayByResidencePlaces.push(islandStayByResidencePlaces)
    }
  }

  toPrimitives() {
    return {
      island: this.island,
      averageStay: this.averageStay,
      islandStayByResidencePlaces: this.islandStayByResidencePlaces
        ? this.islandStayByResidencePlaces.map((stay) => stay.toPrimitives())
        : undefined,
    }
  }
}
