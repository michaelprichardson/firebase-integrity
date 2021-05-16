import { firestore } from 'firebase-admin';
import { testSdk, cleanFirestore } from '../../src/common/test';
import {
  foreignOnDelete,
  decrementOnDelete,
  removeDocumentOnDelete,
} from './firestoreOnDelete';

describe('createFirestoreIntegrity - OnDelete', () => {

  const docId = 'someRandomId';

  beforeEach(async () => {
    await cleanFirestore();
  })

  it('should delete the foreign key in the updateFieldCollection document when a document is deleted from deleteCollection', async () => {
    const collectionRef = firestore().collection('deleteCollection').doc(docId);
    const updateFieldRef = firestore().collection('updateFieldCollection').doc(docId);

    await updateFieldRef.set({
      otherField: 'someData',
      otherId: docId,
    });

    // Test Firestore before trigger
    const beforeUpdateCollection = await collectionRef.get();
    expect(beforeUpdateCollection.exists).toBeFalsy();

    const beforeUpdateField = await updateFieldRef.get();
    expect(beforeUpdateField.exists).toBeTruthy();
    expect(beforeUpdateField.get('otherField')).toBe('someData');
    expect(beforeUpdateField.get('otherId')).toBe(docId);

    // Trigger the create foreign key
    const beforeSnap = testSdk.firestore.makeDocumentSnapshot({ test: 'data' }, `deleteCollection/${docId}`);
    const afterSnap = testSdk.firestore.makeDocumentSnapshot({}, `deleteCollection/${docId}`);
    const change = testSdk.makeChange(beforeSnap, afterSnap);

    const wrappedFunction = testSdk.wrap(foreignOnDelete);
    await wrappedFunction(change, { params: { docId } });

    // Test Firestore after trigger
    const afterUpdateField = await updateFieldRef.get();
    expect(afterUpdateField.exists).toBeTruthy();
    expect(afterUpdateField.get('otherField')).toBe('someData');
    expect(afterUpdateField.get('otherId')).toBeUndefined();
  });

  it('should decrement the tally in decrementCollection document when a document is deleted from deleteCollection', async () => {
    const collectionRef = firestore().collection('deleteCollection').doc(docId);
    const decrementRef = firestore().collection('decrementCollection').doc(docId);

    await decrementRef.set({ tally: 10 });

    // Test Firestore before trigger
    const beforeDecrementCollection = await collectionRef.get();
    expect(beforeDecrementCollection.exists).toBeFalsy();

    const beforeDecrementTally = await decrementRef.get();
    expect(beforeDecrementTally.exists).toBeTruthy();
    expect(beforeDecrementTally.get('tally')).toBe(10);

    // Trigger the decrement
    const beforeSnap = testSdk.firestore.makeDocumentSnapshot({ test: 'data' }, `deleteCollection/${docId}`);
    const afterSnap = testSdk.firestore.makeDocumentSnapshot({}, `deleteCollection/${docId}`);
    const change = testSdk.makeChange(beforeSnap, afterSnap);

    const wrappedFunction = testSdk.wrap(decrementOnDelete);
    await wrappedFunction(change, { params: { docId } });

    // Test Firestore after trigger
    const afterDecrementTally = await decrementRef.get();
    expect(afterDecrementTally.exists).toBeTruthy();
    expect(afterDecrementTally.get('tally')).toBe(9);
  });

  it('should delete the document in deletedDocumentCollection when a document is deleted from deleteCollection', async () => {
    const collectionRef = firestore().collection('deleteCollection').doc(docId);
    const deleteRef = firestore().collection('deletedDocumentCollection').doc(docId);

    await deleteRef.set({ test: 'data' });

    // Test Firestore before trigger
    const beforeDeletionCollection = await collectionRef.get();
    expect(beforeDeletionCollection.exists).toBeFalsy();

    const beforeDeletion = await deleteRef.get();
    expect(beforeDeletion.exists).toBeTruthy();
    expect(beforeDeletion.get('test')).toBe('data');
    

    // Trigger the deletion
    const beforeSnap = testSdk.firestore.makeDocumentSnapshot({ test: 'data' }, `deleteCollection/${docId}`);
    const afterSnap = testSdk.firestore.makeDocumentSnapshot({}, `deleteCollection/${docId}`);
    const change = testSdk.makeChange(beforeSnap, afterSnap);

    const wrappedFunction = testSdk.wrap(removeDocumentOnDelete);
    await wrappedFunction(change, { params: { docId } });

    // Test Firestore after trigger
    const afterDeletion = await deleteRef.get();
    expect(afterDeletion.exists).toBeFalsy();
  });

});