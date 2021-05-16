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

// export const foreignOnCreate = createFirestoreIntegrity({
//   type: FirestoreEventType.OnCreate,
//   documentPath: 'createCollection/{docId}',
//   rules: {
//     firestoreRules: [
//       {
//         action: Action.SetForeignKey,
//         path: 'updateFieldCollection/{docId}',
//         foreignKey: 'otherId'
//       }
//     ]
//   }
// });

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

// export const replicateDocumentOnCreate = createFirestoreIntegrity({
//   type: FirestoreEventType.OnCreate,
//   documentPath: 'createCollection/{docId}',
//   rules: {
//     firestoreRules: [
//       {
//         action: Action.ReplicateDocument,
//         path: 'replicateDocumentCollection/{docId}',
//       }
//     ]
//   }
// });