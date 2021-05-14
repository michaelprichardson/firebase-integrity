import { initializeApp, database, firestore } from 'firebase-admin';

const projectId = 'firebase-integrity-emulator';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_DATABASE_EMULATOR_HOST = 'localhost:9000';
process.env.GOOGLE_CLOUD_PROJECT = projectId;
process.env.PUBSUB_PROJECT_ID = projectId;

initializeApp({
  projectId,
  databaseURL: `https://${projectId}.firebaseio.com`,
});

module.exports = {
  database,
  firestore,
  initializeApp: jest.fn()
} 