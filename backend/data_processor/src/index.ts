import { CronJob } from 'cron'
import { OccupancyRateForecastProcessor } from './processor/occupancyRateForecastProcessor'
import { PackageIds } from './utils/packageIds'

// TODO: mirar el tema de los logs

// const WEEK_TIME = '* 0 0 * * 1'

// TOURISTS AND NATIONALITES
// The processor is instantiated and the packet ids are passed to it
/*const touristsAndNacionalitiesProcessor = new TouristsAndNacionalitiesProcessor([
  PackageIds.TOURISTS_BY_RESIDENCE_PLACE_AND_PERIODS,
  PackageIds.TOURISTS_ACCORDING_RESIDENCE_PLACE_BY_ISLANDS_AND_PERIOD,
])*/

// The initial load of the database is performed
/*touristsAndNacionalitiesProcessor
  .execute()
  .then(() => {
    console.log('Initial load completed to tourists and nacionalities')
  })
  .catch((err) => {
    console.log(err)
  })
*/

// AVERAGE STAYS
// The processor is instantiated and the packet ids are passed to it
/*const averageStaysProcessor = new AverageStayProcessor([
  PackageIds.AVERAGE_STAY_ACCORDING_RESIDENCE_PLACE_BY_ISLANDS_AND_PERIOD,
  PackageIds.AVERAGE_STAY_ACCORDING_ACCOMMODATION_TYPE_AND_RESIDENCE_PLACE,
])*/

// TOURIST SPENDING
// The processor is instantiated and the packet ids are passed to it
/*const touristSpendingProcessor = new TouristSpendingProcessor([
  PackageIds.AVERAGE_SPENDING_WITH_BREAKDOWN,
  PackageIds.TOTAL_SPENDING_WITH_BREAKDOWN,
])*/

// OCCUPANCY RATE FORECAST
// The processor is instantiated and the packet ids are passed to it
const occupancyRateForecastProcessor = new OccupancyRateForecastProcessor([
  PackageIds.EXPECTATIONS_OCCUPANCY_RATE_TREND,
  PackageIds.EXPECTED_OCCUPANCY_RATE,
])

// The initial load of the database is performed
occupancyRateForecastProcessor
  .execute()
  .then((response: string) => {
    console.log(response)
  })
  .catch((err) => {
    console.log(err)
  })

// The cron is executed
const cronJob = new CronJob(
  '0 */1 * * * *',
  () => {
    occupancyRateForecastProcessor
      .execute()
      .then((response: string) => {
        console.log(response)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  null,
  false,
  'Atlantic/Canary'
)

cronJob.start()
