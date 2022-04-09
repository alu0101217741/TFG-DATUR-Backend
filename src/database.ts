import mongoose from 'mongoose';
import config from './config';

const MONGO_URL = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DATABASE}`;

mongoose.connect(MONGO_URL)
    .then((db) => console.log('database is connected to:' + db.connection.name))
    .catch((err) => console.error(err));

module.exports = mongoose;
