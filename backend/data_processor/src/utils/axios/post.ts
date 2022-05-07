import { AxiosError } from 'axios'
import { Data } from '../types/Data'
import { handlingErrors } from './handlingErrors'

const axios = require('axios').default

// Function to add a document to the database.
export async function postDocument(collectionUrl: string, data: Data) {
  await axios
    .post(collectionUrl, data)
    .then(() => {})
    .catch((error: AxiosError) => {
      handlingErrors(error)
    })
}
