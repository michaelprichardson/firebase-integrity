import { CloudFunction } from 'firebase-functions';
import { FirestoreIntegrityConfig, FirestoreEventType } from '../common/rules';
import { Config } from '../common/config';
import { processFirestoreTrigger } from '../firestore/processFunction';

export const createFirestoreTrigger = (firebaseConfig: Config, integrityConfig: FirestoreIntegrityConfig): CloudFunction<any> => {
  return firebaseConfig.functions.firestore.document(integrityConfig.documentPath).onWrite((change, context) => {
    if (!change.before && change.after && integrityConfig.type === FirestoreEventType.OnCreate) {
      return processFirestoreTrigger(firebaseConfig, integrityConfig, change, context);
    } else if (change.before && !change.after && integrityConfig.type === FirestoreEventType.OnDelete) {
      return processFirestoreTrigger(firebaseConfig, integrityConfig, change, context);
    } else if (change.before && change.after && integrityConfig.type === FirestoreEventType.OnUpdate) {
      return processFirestoreTrigger(firebaseConfig, integrityConfig, change, context);
    }
  });
}