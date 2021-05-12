import { firestore, database } from 'firebase-admin';

export interface Config {
  functions: typeof import('firebase-functions')
  firestore: firestore.Firestore
  database: database.Database
}