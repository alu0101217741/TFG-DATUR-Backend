import { AxiosError } from 'axios'

// Function to handle errors that may occur in requests.
export function axiosHandlingErrors(error: AxiosError): void {
  if (error.response) {
    console.log(
      'The request was made and the server responded with a status code that falls out of the range of 2xx'
    )
    console.log(error.response.data)
    console.log(error.response.status)
    console.log(error.response.headers)
  } else if (error.request) {
    console.log('The request was made but no response was received')
    console.log(error.request)
  } else {
    console.log('Something happened in setting up the request that triggered an Error')
    console.log(error.message)
  }
}
