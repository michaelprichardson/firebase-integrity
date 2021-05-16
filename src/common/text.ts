
export const extractVariableFromPath = (context: string, snapshot: boolean = false): { contains: boolean, key: string } => {
  const result = context.match(new RegExp('{(.*?)}', 'g')) || [];

  if (result.length > 0) {
    const last = result[result.length - 1];
    let cleaned = last.replace('{', '').replace('}', '');
    if (snapshot) {
      cleaned.replace('snapshot.', '');
    }
    return { contains: true, key: cleaned };
  } 
  return { contains: false, key: '' };
}

export const replaceKeyWithValue = (path: string, key: string, id: string): string => {
  return path.replace(`{${key}}`, id);
}