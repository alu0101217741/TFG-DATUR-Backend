import axios from 'axios'
import { TouristsAndNacionalitiesProcessor } from '../src/processor/touristsAndNacionalitiesProcessor'
import { PackageIds } from '../src/utils/packageIds'
import { ProcessorResponse } from '../src/utils/types/processorResponse'
import { FAKE_FIRST_PACKAGE, FAKE_SECOND_PACKAGE } from './fixtures/packages'
import { TOURISTS_BY_RESIDENCE_PLACE_AND_PERIODS } from './fixtures/touristByResidenceAndPeriods'
import { TOURISTS_ACCORDING_RESIDENCE_PLACE_BY_ISLANDS_AND_PERIOD } from './fixtures/touristsAccordingPlaceByIslandsAndPeriod'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

const firstDataset = TOURISTS_BY_RESIDENCE_PLACE_AND_PERIODS
const secondDataset = TOURISTS_ACCORDING_RESIDENCE_PLACE_BY_ISLANDS_AND_PERIOD

mockedAxios.get.mockImplementation((url: string) => {
  switch (url) {
    case 'https://datos.canarias.es/catalogos/general/api/action/package_show?id=0bd1385f-fbfb-49ce-b8aa-d8a428454ceb':
      return Promise.resolve({ data: FAKE_FIRST_PACKAGE })
    case 'https://datos.canarias.es/catalogos/general/api/action/package_show?id=4373ada0-58e4-4f74-8c96-c36de97c8fbe':
      return Promise.resolve({ data: FAKE_SECOND_PACKAGE })
    case 'fake-dataset-url':
      return Promise.resolve({ data: firstDataset })
    case 'fake-second-dataset-url':
      return Promise.resolve({ data: secondDataset })
    default:
      return Promise.reject(new Error('not found'))
  }
})

mockedAxios.post.mockImplementation((data) => {
  return Promise.resolve({ data: data })
})

mockedAxios.put.mockImplementation((data) => {
  return Promise.resolve({ data: data })
})

describe('Tourists and Nationalities', () => {
  const touristsAndNacionalitiesProcessor = new TouristsAndNacionalitiesProcessor([
    PackageIds.TOURISTS_BY_RESIDENCE_PLACE_AND_PERIODS,
    PackageIds.TOURISTS_ACCORDING_RESIDENCE_PLACE_BY_ISLANDS_AND_PERIOD,
  ])

  it('correctly processes the data and stores it the first time the processor is executed', async () => {
    const response = await touristsAndNacionalitiesProcessor.execute()

    expect(response).toEqual(ProcessorResponse.DATABASE_MODIFIED)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
  })

  it('does not perform any processing if the datasets have not been updated', async () => {
    const response = await touristsAndNacionalitiesProcessor.execute()

    expect(response).toEqual(ProcessorResponse.NO_MODIFIED_DATASET)
  })

  it('does not modify the database if the minimum common date of the datasets is already stored', async () => {
    firstDataset.categories[1].codes.splice(0, 0, '2022M01')
    firstDataset.categories[1].labels.splice(0, 0, '2022 Enero')
    firstDataset.data.splice(0, 0, {
      Valor: '1025982',
      dimCodes: ['T', '2022M01'],
    })

    const response = await touristsAndNacionalitiesProcessor.execute()

    expect(response).toEqual(ProcessorResponse.COMMON_MINIMUM_DATE_ALREADY_STORED)
  })

  it('the database is updated with the new data if the minimum common date is not stored', async () => {
    secondDataset.categories[1].codes.splice(0, 0, '2022M01')
    secondDataset.categories[1].labels.splice(0, 0, '2022 Enero')
    secondDataset.data.splice(0, 0, {
      Valor: '157522',
      dimCodes: ['T', 'ES708', '2022M01'],
    })

    const response = await touristsAndNacionalitiesProcessor.execute()

    expect(response).toEqual(ProcessorResponse.DATABASE_MODIFIED)
    expect(mockedAxios.post).toHaveBeenCalledTimes(2)
  })

  it('the year is updated if it is already in the database', async () => {
    firstDataset.categories[1].codes.splice(0, 0, '2022M02')
    firstDataset.categories[1].labels.splice(0, 0, '2022 Febrero')
    firstDataset.data.splice(0, 0, {
      Valor: '1025982',
      dimCodes: ['T', '2022M02'],
    })

    secondDataset.categories[1].codes.splice(0, 0, '2022M02')
    secondDataset.categories[1].labels.splice(0, 0, '2022 Febrero')
    secondDataset.data.splice(0, 0, {
      Valor: '157522',
      dimCodes: ['T', 'ES708', '2022M02'],
    })

    const response = await touristsAndNacionalitiesProcessor.execute()

    expect(response).toEqual(ProcessorResponse.DATABASE_MODIFIED)
    expect(mockedAxios.put).toHaveBeenCalledTimes(1)
  })
})
