export const config = {
  mongodb: {
    database: process.env.MONGO_DATABASE || 'tourismDatabase',
    user: process.env.MONGO_USER || 'tourismDatabaseAdmin',
    password: process.env.MONGO_PASSWORD || 'tourismDatabaseAdmin',
    port: process.env.MONGO_PORT || '27017',
    host: process.env.MONGO_HOST || 'localhost',
    collections: {
      touristSpendingCollectionName:
        process.env.TOURISTS_SPENDING_COLLECTION_NAME || 'tourists_spendings',
    },
  },
  openDataInteractor: {
    baseUrl:
      process.env.OPEN_DATA_INTERACTOR_BASE_URL ||
      'https://datos.canarias.es/catalogos/general/api/action/package_show?id=',
  },
}
