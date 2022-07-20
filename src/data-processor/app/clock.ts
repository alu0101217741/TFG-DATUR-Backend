import { CronJob } from 'cron'
import { startDataProcessor } from './worker'

const cronJob = new CronJob({
  cronTime: '0 */10 * * * *',
  onTick: async () => {
    await startDataProcessor()
  },
  start: true,
  timeZone: 'Atlantic/Canary',
})

cronJob.start()
