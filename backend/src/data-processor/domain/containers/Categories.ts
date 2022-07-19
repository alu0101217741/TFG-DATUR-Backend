export type CategoriesPrimitives = ReturnType<Categories['toPrimitives']>

export class Categories {
  static fromPrimitives(categoriesPrimitives: CategoriesPrimitives) {
    return new Categories(
      categoriesPrimitives.description,
      categoriesPrimitives.codes,
      categoriesPrimitives.labelsCodes
    )
  }

  constructor(
    private description: string,
    private codes: string[],
    private labelsCodes: string[]
  ) {}

  getDescription() {
    return this.description
  }

  getCodes() {
    return this.codes
  }

  getLabelsCodes() {
    return this.labelsCodes
  }

  toPrimitives() {
    return {
      description: this.description,
      codes: this.codes,
      labelsCodes: this.labelsCodes,
    }
  }
}
