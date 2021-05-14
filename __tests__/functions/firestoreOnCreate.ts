import {
  initFirebaseIntegrity,
  createFirestoreIntegrity
} from '../../src/index';
import { database, firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Action, FirestoreEventType } from '../../src/common/rules';

initFirebaseIntegrity({
  firestore: firestore(),
  database: database(),
  functions
});

export const incrementOnCreate = createFirestoreIntegrity({
  type: FirestoreEventType.OnCreate,
  documentPath: 'createCollection/{docId}',
  rules: {
    firestoreRules: [
      {
        action: Action.IncrementField,
        path: 'incrementCollection/{docId}',
        incrementField: 'tally'
      }
    ]
  }
});