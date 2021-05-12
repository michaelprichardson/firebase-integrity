import {
  Change,
  EventContext,
  firestore,
  logger
} from 'firebase-functions';
import { Config } from '../common/config';
import { FirestoreIntegrityConfig } from '../common/rules';
import { processFirestoreRule } from './processRule';

export const processFirestoreTrigger = async (
  firebaseConfig: Config,
  integrityConfig: FirestoreIntegrityConfig,
  snapshot: firestore.QueryDocumentSnapshot | Change<firestore.QueryDocumentSnapshot>,
  context: EventContext,
) => {
  const { firestoreRules, databaseRules, storageRules } = integrityConfig.rules;

  const promises = [];

  // Check if there are any rules for Firestore
  if (firestoreRules.length) {
    for (const firestoreRule of firestoreRules) {
      promises.push(processFirestoreRule(
        firebaseConfig,
        integrityConfig.type,
        integrityConfig.documentPath,
        firestoreRule,
        snapshot,
        context,
      ))
    }
  } else {
    logger.warn('No rules for Firestore');
  }

  // Check if there are any rules for Database
  if (databaseRules.length) {
    logger.info('TODO: Need to be implemented');
  } else {
    logger.warn('No rules for Database');
  }

  // Check if there are any rules for Storage
  if (storageRules.length) {
    logger.info('TODO: Need to be implemented');
  } else {
    logger.warn('No rules for Storage');
  }

  await Promise.all(promises);
}