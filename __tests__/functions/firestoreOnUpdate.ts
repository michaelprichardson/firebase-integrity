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

export const updateFieldWhereOnUpdate = createFirestoreIntegrity({
  type: FirestoreEventType.OnUpdate,
  documentPath: 'updateCollection/{docId}',
  rules: {
    firestoreRules: [
      {
        action: Action.UpdateField,
        path: 'updatedFieldCollection/{docId}',
        updateField: [{
          updateKey: 'updated',
          snapshotKey: 'test',
        }],
        where: {
          fieldPath: '',
          operation: '==',
          value: '',
        }
      }
    ]
  }
});

export const updateFieldSnapshotOnUpdate = createFirestoreIntegrity({
  type: FirestoreEventType.OnUpdate,
  documentPath: 'updateCollection/{docId}',
  rules: {
    firestoreRules: [
      {
        action: Action.UpdateField,
        path: 'updatedFieldCollection/{snapshot.docId}', // docId == snapshot.id
        updateField: [{
          updateKey: 'updated',
          snapshotKey: 'test',
        }]
      }
    ]
  }
});

// export const updateDocumentOnUpdate = createFirestoreIntegrity({
//   type: FirestoreEventType.OnUpdate,
//   documentPath: 'updateCollection/{docId}',
//   rules: {
//     firestoreRules: [
//       {
//         action: Action.UpdateDocument,
//         path: 'updatedDocumentCollection/{docId}',
//       }
//     ]
//   }
// });