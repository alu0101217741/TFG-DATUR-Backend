export default {
  MONGO_DATABASE: process.env.MONGO_DATABASE || 'tourism-database',
  MONGO_USER: process.env.MONGO_USER || 'admin',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD ||'admin',
  MONGO_PORT: process.env.MONGO_PORT || '27017',
  MONGO_HOST: process.env.MONGO_HOST || 'localhost',
};
