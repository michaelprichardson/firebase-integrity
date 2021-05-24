import {
  Change,
  EventContext,
  firestore,
  logger
} from 'firebase-functions';
import { Config } from 'src/common/config';
import {
  FirestoreOnCreateIntegrity,
} from 'src/common/rules';
import { processOnCreateFirestoreRule } from './processOnCreateRule';

export const processOnCreateFirestoreTrigger = async (
  firebaseConfig: Config,
  integrityConfig: FirestoreOnCreateIntegrity,
  change: Change<firestore.DocumentSnapshot>,
  context: EventContext,
) => {
  const { firestoreRules, databaseRules, storageRules } = integrityConfig.rules;

  const promises = [];

  // Check if there are any rules for Firestore
  if (firestoreRules) {
    for (const firestoreRule of firestoreRules) {
      promises.push(processOnCreateFirestoreRule(
        firebaseConfig,
        integrityConfig.documentPath,
        firestoreRule,
        change,
        context,
      ))
    }
  } else {
    logger.warn('No rules for Firestore');
  }

  // Check if there are any rules for Database
  if (databaseRules) {
    logger.info('TODO: Need to be implemented');
  } else {
    logger.warn('No rules for Database');
  }

  // Check if there are any rules for Storage
  if (storageRules) {
    logger.info('TODO: Need to be implemented');
  } else {
    logger.warn('No rules for Storage');
  }

  await Promise.all(promises);
}