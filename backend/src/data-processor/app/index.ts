import { CronJob } from 'cron'
import '../../api/db/dbConnection'
import { BusinessProgressExpectationHandler } from './BusinessProgressExpectationHandler'
import { OccupancyRateForecastHandler } from './OccupancyRateForecastHandler'
import { TouristsNumberHandler } from './touristsNumberHandler'
import { TouristSpendingHandler } from './TouristSpendingHandler'
import { TouristStayHandler } from './TouristStayHandler'

const touristSpendingHandler = new TouristSpendingHandler()
const occupancyRateForecastHandler = new OccupancyRateForecastHandler()
const touristStay = new TouristStayHandler()
const businessProgressExpectation = new BusinessProgressExpectationHandler()
const touristsNumber = new TouristsNumberHandler()

// The cron is executed
const cronJob = new CronJob(
  '0 */1 * * * *',
  async () => {
    console.log('Starting...')
    await touristSpendingHandler.execute()
    await occupancyRateForecastHandler.execute()
    await touristStay.execute()
    await businessProgressExpectation.execute()
    await touristsNumber.execute()
  },
  null,
  false,
  'Atlantic/Canary'
)

cronJob.start()
