
export function serializeSpecialNumbers(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'number') {
    if (isNaN(obj)) return 'NaN';
    if (obj === Infinity) return 'Infinity';
    if (obj === -Infinity) return '-Infinity';
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeSpecialNumbers);
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = serializeSpecialNumbers(obj[key]);
      }
    }
    return result;
  }
  
  return obj;
}
