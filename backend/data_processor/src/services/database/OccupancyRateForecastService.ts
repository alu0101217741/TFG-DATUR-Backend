import { Collection, MongoClient } from 'mongodb'
import { MONGODB_URL } from '.'
import { config } from '../../../config'
import {
  OccupancyRateForecast,
  OccupancyRateForecastPrimitives,
} from '../../domain/occupancy-rate-forecast/OccupancyRateForecast'

export class OccupancyRateForecastService {
  private client: MongoClient

  private collection: Collection<OccupancyRateForecastPrimitives>

  private database = config.mongodb.database

  constructor() {
    this.client = new MongoClient(MONGODB_URL)
    const db = this.client.db(this.database)
    this.collection = db.collection(config.mongodb.collections.occupancyRateForecastCollectionName)
  }

  async connect() {
    return this.client.connect()
  }

  async close() {
    return this.client.close()
  }

  async saveData(occupancyRateForecast: OccupancyRateForecast): Promise<void> {
    const occupancyRateForecastPrimitives = occupancyRateForecast.toPrimitives()

    await this.connect()
    const touristSpendingSaved = await this.collection.findOne({
      trimester: occupancyRateForecastPrimitives.trimester,
    })

    if (touristSpendingSaved) {
      await this.collection.updateOne(
        { trimester: occupancyRateForecastPrimitives.trimester },
        { $set: occupancyRateForecastPrimitives }
      )
    } else {
      await this.collection.insertOne(occupancyRateForecastPrimitives)
    }
    await this.close()
  }
}
