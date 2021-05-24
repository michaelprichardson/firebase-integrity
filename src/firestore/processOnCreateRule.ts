import {
  Change,
  EventContext,
  firestore,
  logger
} from 'firebase-functions';
import { firestore as firestoreAdmin } from 'firebase-admin';
import { extractVariableFromPath, replaceKeyWithValue } from '../common/text';
import { Config } from '../common/config';
import {
  FirestoreEventType,
  Action,
} from '../common/rules';

export const processOnCreateFirestoreRule = async (
  firebaseConfig: Config,
  documentPath: string,
  rule: IncrementWhereRule | IncrementStaticRule,
  change: Change<firestore.DocumentSnapshot>,
  context: EventContext,
) => {

  if (isIncrementStaticRule(rule)) {
    logger.debug('Performing an static increment');
  } else if (isIncrementWhereRule(rule)) {
    logger.debug('Performing an increment with where');
  }

  // // TODO: Need to add some validation in here for all the different cases
  // const { contains, key: primaryKey } = extractVariableFromPath(documentPath);
  // if (!contains) {
  //   throw new Error('Missing primary key from document path');
  // }

  // // Get the primary key and create reference to document in rule
  // const primaryId = context.params[primaryKey];
  // const path = replaceKeyWithValue(rule.path, primaryKey, primaryId);
  // const firestoreRef = firebaseConfig.firestore.doc(path);
  
  // // Get the field update value
  // let updateFieldValue;
  // let updateFieldValues;

  // // Update the field to the key of the created document
  // if (rule.foreignKey && eventType === FirestoreEventType.OnCreate) {
  //   updateFieldValue = primaryId;
  // } else if (eventType === FirestoreEventType.OnCreate) {
  //   updateFieldValues = change.after.data();
  // } else if (rule.updateField && eventType === FirestoreEventType.OnUpdate) {
  //   updateFieldValue = change.after.get(rule.updateField.snapshotKey);
  // } else if (rule && eventType === FirestoreEventType.OnUpdate) {
  //   updateFieldValues = change.after.data();
  // }
  
  // if (eventType === FirestoreEventType.OnCreate) {
  //   await processOnCreate(firestoreRef, rule, updateFieldValue, updateFieldValues);
  // } else if (eventType === FirestoreEventType.OnDelete) {
  //   await processOnDelete(firestoreRef, rule);
  // } else if (eventType === FirestoreEventType.OnUpdate) {
  //   await processOnUpdate(firestoreRef, rule, updateFieldValue, updateFieldValues);
  // } else {
  //   logger.error(new Error('Invalid eventType'));
  // }
}