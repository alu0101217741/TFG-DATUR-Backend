import { CronJob } from 'cron'
import { TouristsAndNacionalitiesProcessor } from './processor/touristsAndNacionalitiesProcessor'
import { PackageIds } from './utils/types/packageIds'

// const WEEK_TIME = '* 0 0 * * 1'

// The processor is instantiated and the packet ids are passed to it
const touristsAndNacionalitiesProcessor = new TouristsAndNacionalitiesProcessor([
  PackageIds.TOURISTS_BY_RESIDENCE_PLACE_AND_PERIODS,
  PackageIds.TOURISTS_ACCORDING_RESIDENCE_PLACE_BY_ISLANDS_AND_PERIOD,
])

// The initial load of the database is performed
touristsAndNacionalitiesProcessor
  .execute()
  .then(() => {
    console.log('Initial load completed')
  })
  .catch((err) => {
    console.log(err)
  })

// The cron is executed
const cronJob = new CronJob(
  '0 */10 * * * *',
  () => {
    const b = touristsAndNacionalitiesProcessor.execute()
    console.log(b)
  },
  null,
  false,
  'Atlantic/Canary'
)

cronJob.start()
