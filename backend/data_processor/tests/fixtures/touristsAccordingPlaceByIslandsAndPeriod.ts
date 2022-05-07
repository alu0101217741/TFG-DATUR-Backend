import { DatasetFormat } from '../../src/utils/types/DatasetFormat'

export const TOURISTS_ACCORDING_RESIDENCE_PLACE_BY_ISLANDS_AND_PERIOD: DatasetFormat = {
  uuid: 'fake-uuid',
  title: 'fake-title',
  uriPx: 'fake-uriPx',
  stub: ['fake-stub'],
  heading: ['fake-heading'],
  categories: [
    {
      variable: 'Lugares de residencia',
      codes: ['T', 'DE'],
      labels: ['TOTAL', 'Alemania'],
    },
    {
      variable: 'Periodos',
      codes: ['2021M01'],
      labels: ['2021 Enero'],
    },
    {
      variable: 'Islas',
      codes: ['ES70', 'ES708'],
      labels: ['CANARIAS', 'Lanzarote'],
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
      Valor: '12061',
      dimCodes: ['T', 'ES708', '2021M01'],
    },
  ],
}
