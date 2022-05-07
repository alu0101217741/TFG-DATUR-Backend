export default {
  MONGO_DATABASE: process.env.MONGO_DATABASE || 'tourismDatabase',
  MONGO_USER: process.env.MONGO_USER || 'tourismDatabaseAdmin',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'tourismDatabaseAdmin',
  MONGO_PORT: process.env.MONGO_PORT || '27017',
  MONGO_HOST: process.env.MONGO_HOST || 'localhost',
}
