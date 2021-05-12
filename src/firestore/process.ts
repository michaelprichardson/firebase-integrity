import { Change, EventContext, firestore, logger } from 'firebase-functions';
import { Config } from '../common/config';
import { FirestoreIntegrityConfig } from '../common/rules';

export const processFirestoreTrigger = async (
  firebaseConfig: Config,
  integrityConfig: FirestoreIntegrityConfig,
  snapshot: firestore.QueryDocumentSnapshot | Change<firestore.QueryDocumentSnapshot>,
  context: EventContext,
) => {
  const { firestore, database, storage } = integrityConfig.rules;

  // Check if there are any rules for Firestore
  if (firestore.length) {

  } else {
    logger.warn('No rules for Firestore')
  }

  // Check if there are any rules for Database
  if (database.length) {

  } else {
    logger.warn('No rules for Database')
  }

  // Check if there are any rules for Storage
  if (storage.length) {

  } else {
    logger.warn('No rules for Storage')
  }
}