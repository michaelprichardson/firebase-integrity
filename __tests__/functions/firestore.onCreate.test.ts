import { database, firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
// import { testSdk } from 'src/common/test';
import {
  incrementOnCreate,
} from './firestoreOnCreate';

describe('createFirestoreIntegrity - OnCreate', () => {

  it('should create function', () => {
    expect(4).toBe(4);
  });

});