import { database, firestore } from 'firebase-admin';
import { testSdk } from '../../src/common/test';
import {
  incrementOnCreate,
  foreignOnCreate,
  replicateDocumentOnCreate,
} from './firestoreOnCreate';

describe('createFirestoreIntegrity - OnCreate', () => {

  const docId = 'someRandomId';

  beforeEach(async () => {
    console.log('Clear Firestore and database');
  })

  it('should create the foreign key in the updateFieldCollection document when a document is added to createCollection', async () => {
    const collectionRef = firestore().collection('createCollection').doc(docId);
    const updateFieldRef = firestore().collection('updateFieldCollection').doc(docId);

    await updateFieldRef.set({ otherField: 'someData' });

    // Test Firestore before trigger
    const beforeUpdateCollection = await collectionRef.get();
    expect(beforeUpdateCollection.exists).toBeFalsy();

    const beforeUpdateField = await updateFieldRef.get();
    expect(beforeUpdateField.exists).toBeTruthy();
    expect(beforeUpdateField.get('otherField')).toBe('someData');
    expect(beforeUpdateField.get('otherId')).toBeUndefined();

    // Trigger the create foreign key
    const beforeSnap = testSdk.firestore.makeDocumentSnapshot({}, `createCollection/${docId}`);
    const afterSnap = testSdk.firestore.makeDocumentSnapshot({ test: 'data' }, `createCollection/${docId}`);
    const change = testSdk.makeChange(beforeSnap, afterSnap);

    const wrappedFunction = testSdk.wrap(foreignOnCreate);
    await wrappedFunction(change, { params: { docId } });

    // Test Firestore after trigger
    const afterUpdateField = await updateFieldRef.get();
    expect(afterUpdateField.exists).toBeTruthy();
    expect(afterUpdateField.get('otherField')).toBe('someData');
    expect(afterUpdateField.get('otherId')).toBe(docId);
  });

  it('should increment the tally in incrementCollection document when a document is added to createCollection', async () => {
    const collectionRef = firestore().collection('createCollection').doc(docId);
    const incrementRef = firestore().collection('incrementCollection').doc(docId);

    await incrementRef.set({ tally: 0 });

    // Test Firestore before trigger
    const beforeIncrementCollection = await collectionRef.get();
    expect(beforeIncrementCollection.exists).toBeFalsy();

    const beforeIncrementTally = await incrementRef.get();
    expect(beforeIncrementTally.exists).toBeTruthy();
    expect(beforeIncrementTally.get('tally')).toBe(0);

    // Trigger the increment
    const beforeSnap = testSdk.firestore.makeDocumentSnapshot({}, `createCollection/${docId}`);
    const afterSnap = testSdk.firestore.makeDocumentSnapshot({ test: 'data' }, `createCollection/${docId}`);
    const change = testSdk.makeChange(beforeSnap, afterSnap);

    const wrappedFunction = testSdk.wrap(incrementOnCreate);
    await wrappedFunction(change, { params: { docId } });

    // Test Firestore after trigger
    const afterIncrementTally = await incrementRef.get();
    expect(afterIncrementTally.exists).toBeTruthy();
    expect(afterIncrementTally.get('tally')).toBe(1);
  });

  it('should replicate the document in replicatedCollection when a document is added to createCollection', async () => {
    const collectionRef = firestore().collection('createCollection').doc(docId);
    const replicateRef = firestore().collection('replicateDocumentCollection').doc(docId);

    // Test Firestore before trigger
    const beforeReplicateCollection = await collectionRef.get();
    expect(beforeReplicateCollection.exists).toBeFalsy();

    const beforeReplicate = await replicateRef.get();
    expect(beforeReplicate.exists).toBeFalsy();

    // Trigger the replicate
    const beforeSnap = testSdk.firestore.makeDocumentSnapshot({}, `createCollection/${docId}`);
    const afterSnap = testSdk.firestore.makeDocumentSnapshot({ test: 'data' }, `createCollection/${docId}`);
    const change = testSdk.makeChange(beforeSnap, afterSnap);

    const wrappedFunction = testSdk.wrap(replicateDocumentOnCreate);
    await wrappedFunction(change, { params: { docId } });

    // Test Firestore after trigger
    const afterReplicate = await replicateRef.get();
    expect(afterReplicate.exists).toBeTruthy();
    expect(afterReplicate.get('test')).toBe('data');
  });

});