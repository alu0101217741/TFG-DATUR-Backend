import { connect } from 'mongoose'
import { MONGO_URL } from './mongoose'

connect(MONGO_URL)
  .then((db) => console.log(`Database is connected to:  ${db.connection.name}`))
  .catch((error) => console.error(`Unable to connect to database: ${error.message}`))
