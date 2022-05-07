export enum ProcessorResponse {
  NO_MODIFIED_DATASET = 'NO_MODIFIED_DATASET', // Any dataset has been updated, so no need to update the database.
  COMMON_MINIMUM_DATE_ALREADY_STORED = 'COMMON_MINIMUM_DATE_ALREADY_STORED', // Some datasets has been update, but the common minimum date has already stored
  DATABASE_MODIFIED = 'DATABASE_MODIFIED', // Database has been modified, including the new data.
}
