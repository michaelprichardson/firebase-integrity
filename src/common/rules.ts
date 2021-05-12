import { EventContext } from 'firebase-functions';

export enum FirestoreEventType {
  OnCreate,
  OnDelete,
  OnUpdate,
}

export enum DatabaseEventType {
  OnCreate,
  OnDelete,
  OnUpdate,
}

export type Rule = {
  path: string
  field: boolean
}

export type FirebaseRules = {
  database?: Rule[]
  firestore?: Rule[]
  storage?: Rule[]
}

export type Hook<T> = (
  change: T,
  context: EventContext
) => Promise<void>;

export type FirestoreIntegrityConfig = {
  type: FirestoreEventType
  documentPath: string
  rules: FirebaseRules
}

// export type DatabaseIntegrityRules = {
//   type: RuleType
//   database: Rule[]
//   firestore: Rule[]
//   storage: Rule[]
//   // preHook: Hook<T>
//   // postHook: Hook<T>
// }