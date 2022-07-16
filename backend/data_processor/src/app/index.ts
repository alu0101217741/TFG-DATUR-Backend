// TODO: mirar el tema de los logs

import { CronJob } from 'cron'
import { OccupancyRateForecastHandler } from './OccupancyRateForecastHandler'
import { TouristSpendingHandler } from './TouristSpendingHandler'

const touristSpendingHandler = new TouristSpendingHandler()
const occupancyRateForecastHandler = new OccupancyRateForecastHandler()

// The cron is executed
const cronJob = new CronJob(
  '0 */1 * * * *',
  async () => {
    try {
      console.log('Starting...')
      await touristSpendingHandler.execute()
      await occupancyRateForecastHandler.execute()
    } catch (error) {
      console.log(error)
    }
  },
  null,
  false,
  'Atlantic/Canary'
)

cronJob.start()
