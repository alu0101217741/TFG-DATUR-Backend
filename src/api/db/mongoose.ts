import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export const MONGO_URL = `${process.env.URI_DATABASE_CONNECTION}`

mongoose.createConnection(MONGO_URL, { maxPoolSize: 2 })
