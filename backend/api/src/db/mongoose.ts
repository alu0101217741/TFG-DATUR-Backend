import { connect } from 'mongoose'
import config from './config'

const MONGO_URL = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DATABASE}`

connect(MONGO_URL)
  .then((db) => console.log(`Database is connected to:  ${db.connection.name}`))
  .catch((error) => console.error(`Unable to connect to database: ${error.message}`))
