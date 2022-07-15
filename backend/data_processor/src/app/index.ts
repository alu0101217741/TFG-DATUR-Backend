// TODO: mirar el tema de los logs

import { CronJob } from 'cron'
import { TouristSpendingHandler } from './TouristSpendingHandler'

const touristSpendingHandler = new TouristSpendingHandler()

// The cron is executed
const cronJob = new CronJob(
  '0 */1 * * * *',
  async () => {
    try {
      console.log('Starting...')
      await touristSpendingHandler.execute()
    } catch (error) {
      console.log(error)
    }
  },
  null,
  false,
  'Atlantic/Canary'
)

cronJob.start()
