import { CronJob } from 'cron'
import { startDataProcessor } from './dataProcessorHandler'

const cronJob = new CronJob({
  cronTime: '0 0 20 * * 1',
  onTick: async () => {
    await startDataProcessor()
  },
  start: true,
  timeZone: 'Atlantic/Canary',
})

cronJob.start()
