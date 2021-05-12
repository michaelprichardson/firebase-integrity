import { CloudFunction } from 'firebase-functions';
import { Config } from './common/config';
import { FirestoreIntegrityConfig, FirestoreEventType } from './common/rules';
import { createFirestoreTrigger } from './functions/firestore';

const currentConfig: Config = {
  database: null,
  firestore: null,
  functions: null
};

// Setup the Firebase config
export const initFirebaseIntegrity = (config: Config) => {
  currentConfig.database = config.database;
  currentConfig.firestore = config.firestore;
  currentConfig.functions = config.functions;
};

// Create a Firestore trigger
export const createFirestoreIntegrity = (config: FirestoreIntegrityConfig): CloudFunction<any> => {
  if (!currentConfig.functions) {
    throw new Error('Firebase Integrity has not been initialized, please use initFirebaseIntegrity');
  }

  return createFirestoreTrigger(currentConfig, config);
};

// // Create a Database trigger
// export const createDatabaseIntegrity = (config: DatabaseIntegrityConfig): CloudFunction<any> => {
//   if (!currentConfig.functions) {
//     throw new Error('Firebase Integrity has not been initialized, please use initFirebaseIntegrity');
//   }

//   if (config.type === FirestoreEventType.OnCreate) {
//     return onFirestoreCreate(currentConfig, config);
//   } else if (config.type === FirestoreEventType.OnDelete) {
//     return onFirestoreCreate(currentConfig, config);
//   } else if (config.type === FirestoreEventType.OnUpdate) {
//     return onFirestoreCreate(currentConfig, config);
//   } else {
//     throw new Error(`Unknown rules.type ${config.type}`);
//   }
// };