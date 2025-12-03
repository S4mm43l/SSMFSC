"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeSpecialNumbers = serializeSpecialNumbers;
function serializeSpecialNumbers(obj) {
    if (obj === null || obj === undefined)
        return obj;
    if (typeof obj === 'number') {
        if (isNaN(obj))
            return 'NaN';
        if (obj === Infinity)
            return 'Infinity';
        if (obj === -Infinity)
            return '-Infinity';
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(serializeSpecialNumbers);
    }
    if (typeof obj === 'object') {
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = serializeSpecialNumbers(obj[key]);
            }
        }
        return result;
    }
    return obj;
}
//# sourceMappingURL=serialize-numbers.util.js.map