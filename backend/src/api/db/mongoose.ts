import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export const MONGO_URL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`

mongoose.createConnection(MONGO_URL, { maxPoolSize: 2 })
