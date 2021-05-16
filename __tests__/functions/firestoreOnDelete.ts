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

export const foreignOnDelete = createFirestoreIntegrity({
  type: FirestoreEventType.OnDelete,
  documentPath: 'deleteCollection/{docId}',
  rules: {
    firestoreRules: [
      {
        action: Action.SetForeignKey,
        path: 'updateFieldCollection/{docId}',
        foreignKey: 'otherId'
      }
    ]
  }
});

export const decrementOnDelete = createFirestoreIntegrity({
  type: FirestoreEventType.OnDelete,
  documentPath: 'deleteCollection/{docId}',
  rules: {
    firestoreRules: [
      {
        action: Action.DecrementField,
        path: 'decrementCollection/{docId}',
        decrementField: 'tally'
      }
    ]
  }
});

export const removeDocumentOnDelete = createFirestoreIntegrity({
  type: FirestoreEventType.OnDelete,
  documentPath: 'deleteCollection/{docId}',
  rules: {
    firestoreRules: [
      {
        action: Action.DeleteDocument,
        path: 'deletedDocumentCollection/{docId}',
      }
    ]
  }
});