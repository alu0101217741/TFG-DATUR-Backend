import { Countries } from './types/Countries'
import { Islands } from './types/Islands'
import { TouristsByCountryAndTrimester } from './types/TouristsByCountryAndTrimester'
import { TouristsByIsland } from './types/TouristsByIsland'
import { TrimesterLabel } from './types/TrimesterLabel'

export type TouristsNumberPrimitives = ReturnType<TouristsNumber['toPrimitives']>

export class TouristsNumber {
  static fromPrimitives(touristsNumberPrimitives: TouristsNumberPrimitives) {
    return new TouristsNumber(
      touristsNumberPrimitives.year,
      touristsNumberPrimitives.totalTourists,
      touristsNumberPrimitives.touristsByCountryAndTrimester,
      touristsNumberPrimitives.touristsByIslands
    )
  }

  constructor(
    private year: number,
    private totalTourists: number,
    private touristsByCountryAndTrimester: TouristsByCountryAndTrimester[],
    private touristsByIslands: TouristsByIsland[]
  ) {}

  getYear() {
    return this.year
  }

  getTotalTourists() {
    return this.totalTourists
  }

  getTotalTouristsByIslands(islands: Islands[]) {
    let totalTouristsByIslands = 0
    for (const island of islands) {
      const touristIsland = this.touristsByIslands.find((t) => t.island === island)?.tourists

      if (!touristIsland) throw new Error(`Impossible to find the tourists in ${island}`)

      totalTouristsByIslands += touristIsland
    }

    return totalTouristsByIslands
  }

  addTotalTourists(numberTourists: number) {
    this.totalTourists += numberTourists
  }

  addTouristsByCountryAndTrimester(country: Countries, trimester: TrimesterLabel, value: number) {
    const touristsByCountryAndTrimester = this.touristsByCountryAndTrimester.find(
      (t) => t.country === country
    )

    if (!touristsByCountryAndTrimester) {
      this.touristsByCountryAndTrimester.push({
        country: country,
        firstTrimester: trimester === TrimesterLabel.FIRST_TRIMESTER ? value : 0,
        secondTrimester: trimester === TrimesterLabel.SECOND_TRIMESTER ? value : 0,
        thirdTrimester: trimester === TrimesterLabel.THIRD_TRIMESTER ? value : 0,
        fourthTrimester: trimester === TrimesterLabel.FOURTH_TRIMESTER ? value : 0,
      })
    } else {
      if (trimester === TrimesterLabel.FIRST_TRIMESTER) {
        touristsByCountryAndTrimester.firstTrimester += value
      } else if (trimester === TrimesterLabel.SECOND_TRIMESTER) {
        touristsByCountryAndTrimester.secondTrimester += value
      } else if (trimester === TrimesterLabel.THIRD_TRIMESTER) {
        touristsByCountryAndTrimester.thirdTrimester += value
      } else if (trimester === TrimesterLabel.FOURTH_TRIMESTER) {
        touristsByCountryAndTrimester.fourthTrimester += value
      }
    }
  }

  addTouristsByIsland(island: Islands, value: number) {
    const touristsByIsland = this.touristsByIslands.find((t) => t.island === island)

    if (!touristsByIsland) {
      this.touristsByIslands.push({
        island: island,
        tourists: value,
      })
    } else {
      touristsByIsland.tourists += value
    }
  }

  toPrimitives() {
    return {
      year: this.year,
      totalTourists: this.totalTourists,
      touristsByCountryAndTrimester: this.touristsByCountryAndTrimester,
      touristsByIslands: this.touristsByIslands,
    }
  }
}
