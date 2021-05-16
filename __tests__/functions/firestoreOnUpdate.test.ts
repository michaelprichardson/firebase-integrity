import { firestore } from 'firebase-admin';
import { testSdk, cleanFirestore } from '../../src/common/test';
import {
  updateFieldOnUpdate,
  updateDocumentOnUpdate,
} from './firestoreOnUpdate';

describe('createFirestoreIntegrity - OnDelete', () => {

  const docId = 'someRandomId';

  beforeEach(async () => {
    await cleanFirestore();
  })

  it('', () => {
    expect(true).toBeTruthy();
  });

  it('should update the updated field in the updatedFieldCollection document when a document is updated in updateCollection', async () => {
    const collectionRef = firestore().collection('updateCollection').doc(docId);
    const updateFieldRef = firestore().collection('updatedFieldCollection').doc(docId);

    await updateFieldRef.set({
      otherField: 'someData',
      updated: 'notUpdated',
    });

    // Test Firestore before trigger
    const beforeUpdateCollection = await collectionRef.get();
    expect(beforeUpdateCollection.exists).toBeFalsy();

    const beforeUpdateField = await updateFieldRef.get();
    expect(beforeUpdateField.exists).toBeTruthy();
    expect(beforeUpdateField.get('otherField')).toBe('someData');
    expect(beforeUpdateField.get('updated')).toBe('notUpdated');

    // Trigger the create foreign key
    const beforeSnap = testSdk.firestore.makeDocumentSnapshot({ test: 'oldData' }, `updateCollection/${docId}`);
    const afterSnap = testSdk.firestore.makeDocumentSnapshot({ test: 'updatedData' }, `updateCollection/${docId}`);
    const change = testSdk.makeChange(beforeSnap, afterSnap);

    const wrappedFunction = testSdk.wrap(updateFieldOnUpdate);
    await wrappedFunction(change, { params: { docId } });

    // Test Firestore after trigger
    const afterUpdateField = await updateFieldRef.get();
    expect(afterUpdateField.exists).toBeTruthy();
    expect(afterUpdateField.get('otherField')).toBe('someData');
    expect(afterUpdateField.get('updated')).toBe('updatedData');
  });

  it('should update the document in the updatedDocumentCollection when a document is updated in updateCollection', async () => {
    const collectionRef = firestore().collection('updateCollection').doc(docId);
    const updateFieldRef = firestore().collection('updatedDocumentCollection').doc(docId);

    await updateFieldRef.set({
      otherField: 'someData',
      updated: 'notUpdated',
    });

    // Test Firestore before trigger
    const beforeUpdateCollection = await collectionRef.get();
    expect(beforeUpdateCollection.exists).toBeFalsy();

    const beforeUpdateField = await updateFieldRef.get();
    expect(beforeUpdateField.exists).toBeTruthy();
    expect(beforeUpdateField.get('otherField')).toBe('someData');
    expect(beforeUpdateField.get('updated')).toBe('notUpdated');

    // Trigger the create foreign key
    const beforeSnap = testSdk.firestore.makeDocumentSnapshot({ test: 'oldData' }, `updateCollection/${docId}`);
    const afterSnap = testSdk.firestore.makeDocumentSnapshot({
      otherField: 'newData',
      updated: 'updatedData',
    }, `updateCollection/${docId}`);
    const change = testSdk.makeChange(beforeSnap, afterSnap);

    const wrappedFunction = testSdk.wrap(updateDocumentOnUpdate);
    await wrappedFunction(change, { params: { docId } });

    // Test Firestore after trigger
    const afterUpdateField = await updateFieldRef.get();
    expect(afterUpdateField.exists).toBeTruthy();
    expect(afterUpdateField.get('otherField')).toBe('newData');
    expect(afterUpdateField.get('updated')).toBe('updatedData');
  });

});