import { CloudFunction } from 'firebase-functions';
import { FirestoreOnCreateIntegrity, FirestoreOnDeleteIntegrity, FirestoreOnUpdateIntegrity } from '../common/rules';
import { Config } from '../common/config';
import { processOnCreateFirestoreTrigger } from '../firestore/processOnCreateFunction';

export const createFirestoreTrigger = (firebaseConfig: Config, integrityConfig: FirestoreOnCreateIntegrity | FirestoreOnDeleteIntegrity | FirestoreOnUpdateIntegrity): CloudFunction<any> => {
  return firebaseConfig.functions.firestore.document(integrityConfig.documentPath).onWrite((change, context) => {

    const isCreate = !change.before.exists
    const isDelete = !change.after.exists
    const isUpdate = change.before.exists && change.after.exists
    
    console.log(`isCreate ${isCreate} isDelete ${isDelete} isUpdate ${isUpdate}`);

    if (isCreate) {
      return processOnCreateFirestoreTrigger(
        firebaseConfig,
        integrityConfig as FirestoreOnCreateIntegrity,
        change,
        context
      );
    } else if (isDelete) {
      // return processFirestoreTrigger(firebaseConfig, integrityConfig, change, context);
    } else if (isUpdate) {
      // return processFirestoreTrigger(firebaseConfig, integrityConfig, change, context);
    }
  });
}