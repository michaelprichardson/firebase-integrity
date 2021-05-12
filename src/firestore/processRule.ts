import {
  Change,
  EventContext,
  firestore,
  logger
} from 'firebase-functions';
import { firestore as firestoreAdmin } from 'firebase-admin';
import { getIdFromContext, replaceKeyWithValue } from 'src/common/text';
import { Config } from '../common/config';
import { FirestoreEventType, BaseRule, Action } from '../common/rules';

export const processFirestoreRule = async (
  firebaseConfig: Config,
  eventType: FirestoreEventType,
  documentPath: string,
  rule: BaseRule,
  snapshot: firestore.QueryDocumentSnapshot | Change<firestore.QueryDocumentSnapshot>,
  context: EventContext,
) => {
  // TODO: Need to add some validation in here for all the different cases
  const { contains, key: primaryKey } = getIdFromContext(documentPath);
  if (!contains) {
    throw new Error('Missing primary key from document path');
  }

  // Get the primary key and create reference to document in rule
  const primaryId = context[primaryKey];
  const path = replaceKeyWithValue(rule.path, primaryKey, primaryId);
  const firestoreRef = firebaseConfig.firestore.doc(path);

  // Get the field update value
  let updateFieldValue;
  let updateFieldValues;
  if (rule.field || rule.updateField) {
    const { contains, key: foreignKey } = getIdFromContext(rule.path);
    if (!contains) {
      logger.error(new Error('Missing foreign key in update path'));
    }

    if (eventType === FirestoreEventType.OnUpdate) {
      const snap = snapshot as Change<firestore.QueryDocumentSnapshot>;
      updateFieldValue = snap.after.get(foreignKey);
      updateFieldValues = snap.after.data();
    } else {
      const snap = snapshot as firestore.QueryDocumentSnapshot;
      updateFieldValue = snap.get(foreignKey);
    }
  }
  
  if (eventType === FirestoreEventType.OnCreate) {
    await processOnCreate(firestoreRef, rule, updateFieldValue);
  } else if (eventType === FirestoreEventType.OnDelete) {
    await processOnDelete(firestoreRef, rule);
  } else if (eventType === FirestoreEventType.OnUpdate) {
    await processOnUpdate(firestoreRef, rule, updateFieldValue, updateFieldValues);
  } else {
    logger.error(new Error('Invalid eventType'));
  }
}

const processOnCreate = async (firestore: firestoreAdmin.DocumentReference, rule: BaseRule, updateValue: any) => {
  if (rule.action === Action.CreateField && rule.field) {
    await firestore.set({ [rule.field.key]: updateValue }, { merge: true });
  } else if (rule.action === Action.IncrementField && rule.incrementField) {
    await firestore.update({ [rule.incrementField]: firestoreAdmin.FieldValue.increment(1) });
  } else {
    logger.error(new Error('Invalid action for OnCreate event'));
  }
}

const processOnDelete = async (firestore: firestoreAdmin.DocumentReference, rule: BaseRule) => {
  if (rule.action === Action.DeleteField && rule.updateField) {
    await firestore.update({ [rule.updateField]: firestoreAdmin.FieldValue.delete });
  } else if (rule.action === Action.DeleteDocument) {
    await firestore.delete();
  } else if (rule.action === Action.DecrementField && rule.decrementField) {
    await firestore.update({ [rule.decrementField]: firestoreAdmin.FieldValue.increment(-1) });
  } else {
    logger.error(new Error('Invalid action for OnDelete event'));
  }
}

const processOnUpdate = async (firestore: firestoreAdmin.DocumentReference, rule: BaseRule, updateValue: any, updateValues: any) => {
  if (rule.action === Action.UpdateField && rule.updateField) {
    await firestore.update({ [rule.updateField]: updateValue });
  } else if (rule.action === Action.UpdateDocument) {
    await firestore.update(updateValues);
  } else {
    logger.error(new Error('Invalid action for OnUpdate event'));
  }
}