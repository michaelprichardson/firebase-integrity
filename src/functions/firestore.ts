import { CloudFunction, logger } from 'firebase-functions';
import { FirestoreIntegrityConfig, FirestoreEventType } from '../common/rules';
import { Config } from '../common/config';
import { processFirestoreTrigger } from '../firestore/processFunction';

export const createFirestoreTrigger = (firebaseConfig: Config, integrityConfig: FirestoreIntegrityConfig): CloudFunction<any> => {
  return firebaseConfig.functions.firestore.document(integrityConfig.documentPath).onWrite((change, context) => {

    const isCreate = !change.before.exists
    const isDelete = !change.after.exists
    const isUpdate = change.before.exists && change.after.exists
    
    console.log(`isCreate ${isCreate} isDelete ${isDelete} isUpdate ${isUpdate}`);

    if (isCreate && integrityConfig.type === FirestoreEventType.OnCreate) {
      return processFirestoreTrigger(firebaseConfig, integrityConfig, change, context);
    } else if (isDelete && integrityConfig.type === FirestoreEventType.OnDelete) {
      return processFirestoreTrigger(firebaseConfig, integrityConfig, change, context);
    } else if (isUpdate && integrityConfig.type === FirestoreEventType.OnUpdate) {
      return processFirestoreTrigger(firebaseConfig, integrityConfig, change, context);
    }
  });
}