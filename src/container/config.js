if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export default {
  PORT: process.env.PORT || 4000,
  DB_USER_MONGO: process.env.DB_USER_MONGO,
  DB_KEY_MONGO: process.env.DB_KEY_MONGO,
  DB_HOST_MONGO: process.env.DB_HOST_MONGO,
  DB_CONTAINER_NAME_MONGO: process.env.DB_CONTAINER_NAME_MONGO,
  DB_COLLECTION_NAME_MONGO: process.env.DB_COLLECTION_NAME_MONGO,
  CATALOG_TTL_MS: eval(process.env.CATALOG_TTL_MS),
  GOOGLE_MAPS_API_URL: process.env.GOOGLE_MAPS_API_URL,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
};
