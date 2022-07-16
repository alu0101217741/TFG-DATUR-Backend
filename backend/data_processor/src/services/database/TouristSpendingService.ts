import { Collection, MongoClient } from 'mongodb'
import { MONGODB_URL } from '.'
import { config } from '../../../config'
import {
  TouristSpending,
  TouristSpendingPrimitives,
} from '../../domain/tourist-spending/TouristSpending'

export class TouristSpendingService {
  private client: MongoClient

  private collection: Collection<TouristSpendingPrimitives>

  private database = config.mongodb.database

  constructor() {
    this.client = new MongoClient(MONGODB_URL)
    const db = this.client.db(this.database)
    this.collection = db.collection(config.mongodb.collections.touristSpendingCollectionName)
  }

  async connect() {
    return this.client.connect()
  }

  async close() {
    return this.client.close()
  }

  async saveData(touristSpending: TouristSpending): Promise<void> {
    const touristSpendingDataPrimitives = touristSpending.toPrimitives()

    await this.connect()
    const touristSpendingSaved = await this.collection.findOne({
      trimester: touristSpendingDataPrimitives.trimester,
    })

    if (touristSpendingSaved) {
      await this.collection.updateOne(
        { trimester: touristSpendingDataPrimitives.trimester },
        { $set: touristSpendingDataPrimitives }
      )
    } else {
      await this.collection.insertOne(touristSpendingDataPrimitives)
    }
    await this.close()
  }
}
