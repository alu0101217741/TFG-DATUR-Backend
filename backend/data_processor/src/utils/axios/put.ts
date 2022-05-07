import { AxiosError } from 'axios'
import { Data } from '../types/Data'
import { handlingErrors } from './handlingErrors'

const axios = require('axios').default

// Function to update a document from the database.
export async function putDocument(collectionUrl: string, data: Data) {
  await axios
    .put(collectionUrl, data)
    .then(() => {})
    .catch((error: AxiosError) => {
      handlingErrors(error)
    })
}
