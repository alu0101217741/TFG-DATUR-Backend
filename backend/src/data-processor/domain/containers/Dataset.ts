import { Categories } from './Categories'
import { Data } from './Data'

export type DatasetPrimitives = ReturnType<Dataset['toPrimitives']>

export class Dataset {
  static fromPrimitives(datasetPrimitives: DatasetPrimitives) {
    const categories = datasetPrimitives.categories.map((c) => Categories.fromPrimitives(c))

    const data = datasetPrimitives.data.map((d) => Data.fromPrimitives(d))

    return new Dataset(datasetPrimitives.externalId, categories, data)
  }

  constructor(private externalId: string, private categories: Categories[], private data: Data[]) {}

  getCodesForCategory(categoryDescription: string) {
    const category = this.categories.find((c) => c.getDescription() === categoryDescription)

    if (!category) {
      throw new Error(`Codes for category ${categoryDescription} not found`)
    }

    return category.getCodes()
  }

  getLabelsForCategory(categoryDescription: string) {
    const category = this.categories.find((c) => c.getDescription() === categoryDescription)

    if (!category) {
      throw new Error(`Labels for category ${category} not found`)
    }

    return category.getLabelsCodes()
  }

  toPrimitives() {
    return {
      externalId: this.externalId,
      categories: this.categories.map((c) => c.toPrimitives()),
      data: this.data.map((d) => d.toPrimitives()),
    }
  }
}
