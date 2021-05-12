
export const getIdFromContext = (context: string): { contains: boolean, key: string } => {
  const result = context.match(new RegExp('{(.*?)}', 'g')) || [];

  if (result.length > 0) {
    const last = result[result.length - 1];
    const cleaned = last.replace('{', '').replace('}', '');
    return { contains: true, key: cleaned };
  } 
  return { contains: false, key: '' };
}

export const replaceKeyWithValue = (path: string, key: string, id: string): string => {
  return path.replace(`{${key}}`, id);
}