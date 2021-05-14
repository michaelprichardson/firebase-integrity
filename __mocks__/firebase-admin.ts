import { initializeApp, database, firestore } from 'firebase-admin';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.GOOGLE_CLOUD_PROJECT = 'firebase-integrity-emulator';
process.env.PUBSUB_PROJECT_ID = 'firebase-integrity-emulator';

initializeApp();

module.exports = {
  database,
  firestore,
  initializeApp: jest.fn()
} 