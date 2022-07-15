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

  async saveData(touristSpendingData: TouristSpending[]): Promise<void> {
    await this.connect()
    await this.collection.insertMany(touristSpendingData.map((data) => data.toPrimitives()))
    await this.close()
  }
}
