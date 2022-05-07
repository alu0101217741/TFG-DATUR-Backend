export type DatasetFormat = {
  uuid: string
  title: string
  uriPx: string
  stub: string[]
  heading: string[]
  categories: {
    variable: string
    codes: string[]
    labels: string[]
  }[]
  temporals: string[]
  spatials: string[]
  notes: string[]
  source: string
  surveyCode: string
  surveyTitle: string
  publishers: string[]
  data: {
    Valor: string
    dimCodes: string[]
  }[]
}
