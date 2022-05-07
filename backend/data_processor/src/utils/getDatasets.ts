import { getDataset, getJsonResource } from './axios/get'
import { DatasetFormat } from './types/DatasetFormat'

const OPEN_API_URL = 'https://datos.canarias.es/catalogos/general/api/action/package_show?id='

export async function getDatasets(packageIds: string[]): Promise<DatasetFormat[]> {
  const datasets: DatasetFormat[] = []

  for (const packageId of packageIds) {
    const jsonResource = await getJsonResource(OPEN_API_URL + packageId)

    if (!jsonResource) {
      throw new Error(`Package with id ${packageId} not found`)
    }

    const dataset = await getDataset(jsonResource.url)

    if (!dataset) {
      throw new Error(`Dataset belonging to package ${packageId} not found`)
    }

    datasets.push(dataset)
  }

  return datasets
}
