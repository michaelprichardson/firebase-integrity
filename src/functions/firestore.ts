import { CloudFunction, firestore } from 'firebase-functions';
import { FirestoreIntegrityConfig, FirestoreEventType } from 'src/common/rules';
import { Config } from 'src/common/config';
import { processFirestoreTrigger } from 'src/firestore/processFunction';

export const createFirestoreTrigger = (firebaseConfig: Config, integrityConfig: FirestoreIntegrityConfig): CloudFunction<any> => {
  if (integrityConfig.type === FirestoreEventType.OnCreate) {
    return firestore.document(integrityConfig.documentPath).onCreate((snapshot, context) => {
      return processFirestoreTrigger(firebaseConfig, integrityConfig, snapshot, context);
    });
  } else if (integrityConfig.type === FirestoreEventType.OnDelete) {
    return firestore.document(integrityConfig.documentPath).onDelete((snapshot, context) => {
      return processFirestoreTrigger(firebaseConfig, integrityConfig, snapshot, context);
    });
  } else if (integrityConfig.type === FirestoreEventType.OnUpdate) {
    return firestore.document(integrityConfig.documentPath).onUpdate((change, context) => {
      return processFirestoreTrigger(firebaseConfig, integrityConfig, change, context);
    });
  }
}