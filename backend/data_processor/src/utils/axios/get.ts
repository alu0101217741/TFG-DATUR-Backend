import { AxiosError, AxiosResponse } from 'axios'
import { DatasetFormat } from '../types/DatasetFormat'
import { PackageFormat } from '../types/PackageFormat'
import { ServerResource } from '../types/ServerResource'
import { handlingErrors } from './handlingErrors'

const axios = require('axios').default

// Function to get the JSON resource from the Open Api.
export async function getJsonResource(url: string): Promise<ServerResource | undefined> {
  let jsonResource: ServerResource | undefined

  await axios
    .get(url)
    .then((response: AxiosResponse<PackageFormat>) => {
      jsonResource = response.data.result.resources.find((resource) => resource.format === 'JSON')
    })
    .catch((error: AxiosError) => {
      handlingErrors(error)
    })

  return jsonResource
}

// Function to get the dataset.
export async function getDataset(datasetURL: string): Promise<DatasetFormat | undefined> {
  let dataset: DatasetFormat | undefined

  await axios
    .get(datasetURL)
    .then((response: AxiosResponse<DatasetFormat>) => {
      dataset = response.data
    })
    .catch((error: AxiosError) => {
      handlingErrors(error)
    })

  return dataset
}
