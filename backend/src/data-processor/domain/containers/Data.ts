export type DataPrimitives = ReturnType<Data['toPrimitives']>

export class Data {
  static fromPrimitives(dataPrimitives: DataPrimitives) {
    const dataValue = isNaN(Number(dataPrimitives.dataValue)) ? '0' : dataPrimitives.dataValue

    return new Data(dataValue, dataPrimitives.categoryCodes)
  }

  constructor(private dataValue: string, private categoryCodes: string[]) {}

  toPrimitives() {
    return {
      dataValue: this.dataValue,
      categoryCodes: this.categoryCodes,
    }
  }
}
