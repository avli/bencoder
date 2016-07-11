'use strict';
function encodeString(s) {
    return s.length + ':' + s;
}
function decodeString(data) {
    return '';
}
function encodeInteger(i) {
    return 'i' + i + 'e';
}
function encodeArray(l) {
    var result = 'l';
    l.forEach(function (element) {
        result += encode(element);
    });
    return result + 'e';
}
function encodeDict(d) {
    var result = 'd';
    var keys = Object.keys(d).sort();
    keys.forEach(function (k) {
        result += (encodeString(k) + encode(d[k]));
    });
    return result + 'e';
}
function isArray(obj) {
    if (typeof obj === 'object') {
        return obj.constructor === Array ? true : false;
    }
    return false;
}
function encode(data) {
    switch (typeof data) {
        case 'string':
            return encodeString(data);
        case 'number':
            return encodeInteger(data);
        case 'object':
            if (isArray(data)) {
                return encodeArray(data);
            }
            else {
                return encodeDict(data);
            }
    }
}
exports.encode = encode;
//# sourceMappingURL=bencoder.js.map