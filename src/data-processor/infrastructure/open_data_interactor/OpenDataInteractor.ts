import axios, { AxiosError, AxiosResponse } from 'axios'
import { config } from '../../config'
import { Dataset } from '../../domain/containers/Dataset'
import { axiosHandlingErrors } from '../../utils/axiosHandlingErrors'
import { DatasetResponse } from './types/DatasetResponse'
import { JsonMetadataResponse } from './types/JsonMetadataResponse'
import { PackageFormat } from './types/PackageFormat'

export class OpenDataInteractor {
  async getData(dataIds: string[]): Promise<Dataset[]> {
    const datasets: Dataset[] = []

    for (const dataId of dataIds) {
      const jsonResourceUrl = await this.getJsonResource(config.openDataInteractor.baseUrl + dataId)

      const dataset = await this.getDataset(jsonResourceUrl)

      datasets.push(
        Dataset.fromPrimitives({
          externalId: dataset.uuid,
          categories: dataset.categories.map((category) => {
            return {
              description: category.variable,
              codes: category.codes,
              labelsCodes: category.labels,
            }
          }),
          data: dataset.data.map((data) => {
            return {
              dataValue: data.Valor,
              categoryCodes: data.dimCodes,
            }
          }),
        })
      )
    }

    return datasets
  }

  private async getJsonResource(url: string): Promise<string> {
    let jsonResource: JsonMetadataResponse | undefined

    await axios
      .get(url)
      .then((response: AxiosResponse<PackageFormat>) => {
        jsonResource = response.data.result.resources.find((resource) => resource.format === 'JSON')
      })
      .catch((error: AxiosError) => {
        axiosHandlingErrors(error)
      })

    if (!jsonResource) {
      throw new Error(`JSON resource with url ${url} not found`)
    }

    return jsonResource.url
  }

  private async getDataset(datasetURL: string): Promise<DatasetResponse> {
    let dataset: DatasetResponse | undefined

    await axios
      .get(datasetURL)
      .then((response: AxiosResponse<DatasetResponse>) => {
        dataset = response.data
      })
      .catch((error: AxiosError) => {
        axiosHandlingErrors(error)
      })

    if (!dataset) {
      throw new Error(`Dataset with url ${datasetURL} not found`)
    }

    return dataset
  }
}
