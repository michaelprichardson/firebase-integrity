import {
  getIdFromContext,
  replaceKeyWithValue,
} from '../../common/text';

describe('getIdFromContext', () => {
  
  it('should contain the key for 1 key present', () => {
    const path = 'collection1/{primaryKey}';

    const { contains, key } = getIdFromContext(path);

    expect(contains).toBeTruthy();
    expect(key).toBe('primaryKey');
  });

});

describe('replaceKeyWithValue', () => {
  
  it('should replace the primary key with the foreign key', () => {
    const primaryKey = 'primaryKey';
    const primaryId = 'primaryId'
    const path = `collection1/{${primaryKey}}`;
    
    const completePath = replaceKeyWithValue(path, primaryKey, primaryId);

    expect(completePath).toBe(`collection1/${primaryId}`);
  });

});