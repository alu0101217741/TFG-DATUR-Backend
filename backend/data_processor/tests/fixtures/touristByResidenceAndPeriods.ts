import { DatasetFormat } from '../../src/utils/types/DatasetFormat'

export const TOURISTS_BY_RESIDENCE_PLACE_AND_PERIODS: DatasetFormat = {
  uuid: 'fake-uuid',
  title: 'fake-title',
  uriPx: 'fake-uriPx',
  stub: ['fake-stub'],
  heading: ['fake-heading'],
  categories: [
    {
      variable: 'Lugares de residencia',
      codes: ['T', 'T1', 'DE'],
      labels: ['TOTAL', 'TOTAL RESIDENTES EN EL EXTRANJERO', 'Alemania'],
    },
    {
      variable: 'Periodos',
      codes: ['2021M01'],
      labels: ['2021 Enero'],
    },
  ],
  temporals: ['fake-temporals'],
  spatials: ['fake-spatials'],
  notes: ['fake-notes'],
  source: 'fake-source',
  surveyCode: 'fake-surveyCode',
  surveyTitle: 'fake-surveyTitle',
  publishers: ['fake-publishers'],
  data: [
    {
      Valor: '123686',
      dimCodes: ['T', '2021M01'],
    },
    {
      Valor: '28178',
      dimCodes: ['DE', '2021M01'],
    },
  ],
}
