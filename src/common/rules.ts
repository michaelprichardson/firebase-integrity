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

export enum Action {
  CreateField,
  ReplicateDocument,
  IncrementField,
  DeleteField,
  DeleteDocument,
  DecrementField,
  UpdateField,
  UpdateDocument,
}

export type BaseRule = {
  action: Action
  path: string
  field?: {
    key: string
    value: string
  }
  incrementField?: string
  decrementField?: string
  updateField?: string
};

export type IntegrityRules = {
  databaseRules?: BaseRule[]
  firestoreRules?: BaseRule[]
  storageRules?: BaseRule[]
}

export type Hook<T> = (
  change: T,
  context: EventContext
) => Promise<void>;

export type FirestoreIntegrityConfig = {
  type: FirestoreEventType
  documentPath: string
  rules: IntegrityRules
}

// export type DatabaseIntegrityRules = {
//   type: RuleType
//   database: Rule[]
//   firestore: Rule[]
//   storage: Rule[]
//   // preHook: Hook<T>
//   // postHook: Hook<T>
// }


// A delete should decrement, delete a document or field

// A create should increment or replicate the document in another collection or create a field

// An update should update another document or the field that was updated