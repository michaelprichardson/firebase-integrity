import {
  Change,
  EventContext,
  firestore,
  logger
} from 'firebase-functions';
import { firestore as firestoreAdmin } from 'firebase-admin';
import { extractVariableFromPath, replaceKeyWithValue } from '../common/text';
import { Config } from '../common/config';
import { FirestoreEventType, BaseRule, Action } from '../common/rules';

export const processFirestoreRule = async (
  firebaseConfig: Config,
  eventType: FirestoreEventType,
  documentPath: string,
  rule: BaseRule,
  change: Change<firestore.DocumentSnapshot>,
  context: EventContext,
) => {
  // TODO: Need to add some validation in here for all the different cases
  const { contains, key: primaryKey } = extractVariableFromPath(documentPath);
  if (!contains) {
    throw new Error('Missing primary key from document path');
  }

  // Get the primary key and create reference to document in rule
  const primaryId = context.params[primaryKey];
  const path = replaceKeyWithValue(rule.path, primaryKey, primaryId);
  const firestoreRef = firebaseConfig.firestore.doc(path);
  
  // Get the field update value
  let updateFieldValue;
  let updateFieldValues;

  // Update the field to the key of the created document
  if (rule.foreignKey && eventType === FirestoreEventType.OnCreate) {
    updateFieldValue = primaryId;
  } else if (eventType === FirestoreEventType.OnCreate) {
    updateFieldValues = change.after.data();
  } else if (rule.updateField && eventType === FirestoreEventType.OnUpdate) {
    updateFieldValue = change.after.get(rule.updateField.snapshotKey);
  } else if (rule && eventType === FirestoreEventType.OnUpdate) {
    updateFieldValues = change.after.data();
  }
  
  if (eventType === FirestoreEventType.OnCreate) {
    await processOnCreate(firestoreRef, rule, updateFieldValue, updateFieldValues);
  } else if (eventType === FirestoreEventType.OnDelete) {
    await processOnDelete(firestoreRef, rule);
  } else if (eventType === FirestoreEventType.OnUpdate) {
    await processOnUpdate(firestoreRef, rule, updateFieldValue, updateFieldValues);
  } else {
    logger.error(new Error('Invalid eventType'));
  }
}

const processOnCreate = async (firestore: firestoreAdmin.DocumentReference, rule: BaseRule, updateValue: any, updateValues: any) => {
  if (rule.action === Action.SetForeignKey && rule.foreignKey) {
    await firestore.set({ [rule.foreignKey]: updateValue }, { merge: true });
  } else if (rule.action === Action.IncrementField && rule.incrementField) {
    await firestore.update({ [rule.incrementField]: firestoreAdmin.FieldValue.increment(1) });
  } else if (rule.action === Action.ReplicateDocument) {
    await firestore.set(updateValues, { merge: true });
  }else {
    logger.error(new Error('Invalid action for OnCreate event'));
  }
}

const processOnDelete = async (firestore: firestoreAdmin.DocumentReference, rule: BaseRule) => {
  console.log(rule)
  if (rule.action === Action.SetForeignKey && rule.foreignKey) {
    await firestore.update({ [rule.foreignKey]: firestoreAdmin.FieldValue.delete() });
  } else if (rule.action === Action.DecrementField && rule.decrementField) {
    await firestore.update({ [rule.decrementField]: firestoreAdmin.FieldValue.increment(-1) });
  } else if (rule.action === Action.DeleteDocument) {
    await firestore.delete();
  } else {
    logger.error(new Error('Invalid action for OnDelete event'));
  }
}

const processOnUpdate = async (firestore: firestoreAdmin.DocumentReference, rule: BaseRule, updateValue: any, updateValues: any) => {
  if (rule.action === Action.UpdateField && rule.updateField) {
    await firestore.update({ [rule.updateField.updateKey]: updateValue });
  } else if (rule.action === Action.UpdateDocument) {
    await firestore.update(updateValues);
  } else {
    logger.error(new Error('Invalid action for OnUpdate event'));
  }
}