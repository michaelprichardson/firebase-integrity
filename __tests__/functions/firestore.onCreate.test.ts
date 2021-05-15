import { database, firestore } from 'firebase-admin';
import { testSdk } from '../../src/common/test';
import {
  incrementOnCreate,
} from './firestoreOnCreate';

describe('createFirestoreIntegrity - OnCreate', () => {

  const wrappedFunction = testSdk.wrap(incrementOnCreate);

  const docId = 'someRandomId';

  beforeEach(async () => {
    console.log('Clear Firestore and database');
  })

  it('should increment the file {} when a document is added to {}', async () => {
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
    await wrappedFunction(change, { params: { docId } });

    // Test Firestore after trigger
    const afterIncrementTally = await incrementRef.get();
    expect(afterIncrementTally.exists).toBeTruthy();
    expect(afterIncrementTally.get('tally')).toBe(1);
  });

});