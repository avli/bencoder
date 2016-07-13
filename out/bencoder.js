'use strict';
var buffer_1 = require('buffer');
/*
Encoding
*/
function encodeString(s) {
    var bytes = buffer_1.Buffer.from(s);
    return buffer_1.Buffer.concat([
        buffer_1.Buffer.from(bytes.length.toString()),
        buffer_1.Buffer.from(':'),
        bytes]);
}
function encodeInteger(i) {
    return buffer_1.Buffer.from("i" + i + "e");
}
function encodeArray(l) {
    var result = [buffer_1.Buffer.from('l')];
    l.forEach(function (element) {
        result.push(_encode(element));
    });
    result.push(buffer_1.Buffer.from('e'));
    return buffer_1.Buffer.concat(result);
}
function encodeDict(d) {
    var result = [buffer_1.Buffer.from('d')];
    var keys = Object.keys(d).sort();
    keys.forEach(function (k) {
        result.push(encodeString(k));
        result.push(encode(d[k]));
    });
    result.push(buffer_1.Buffer.from('e'));
    return buffer_1.Buffer.concat(result);
}
function isArray(obj) {
    if (typeof obj === 'object') {
        return obj.constructor === Array ? true : false;
    }
    return false;
}
function _encode(data) {
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
/**
 * Encodes data in bencode.
 *
 * @param {Array|String|Object|Number} data
 * @return {Buffer}
 */
function encode(data) {
    return new buffer_1.Buffer(_encode(data));
}
exports.encode = encode;
/*
Decoding
*/
var Delimeters;
(function (Delimeters) {
    Delimeters[Delimeters["i"] = 105] = "i";
    Delimeters[Delimeters["e"] = 101] = "e";
    Delimeters[Delimeters["l"] = 108] = "l";
    Delimeters[Delimeters["d"] = 100] = "d";
    Delimeters[Delimeters["colon"] = 58] = "colon";
})(Delimeters || (Delimeters = {}));
function decodeString(data, encoding) {
    var firstColonIndex = null;
    for (var i = 0; i < data.length; i++) {
        if (data[i] === Delimeters.colon) {
            firstColonIndex = i;
            break;
        }
    }
    // TODO: Make the message more meaningful.
    if (!firstColonIndex) {
        throw "Invalid data. Missing colon.";
    }
    var expectedLength = parseInt(data.slice(0, firstColonIndex).toString());
    var value = data.slice(firstColonIndex + 1, firstColonIndex + 1 + expectedLength);
    // TODO: Make the message more meaningful.
    if (expectedLength !== value.length) {
        throw "Invalid data. String length is not equal the expected one.";
    }
    else {
        return { value: value.toString(encoding), rest: data.slice(firstColonIndex + 1 + expectedLength) };
    }
}
exports.decodeString = decodeString;
function decodeInteger(data) {
    var endIndex = null; // The first 'e' symbol index
    for (var i = 1; i < data.length; i++) {
        if (data[i] === Delimeters.e) {
            endIndex = i;
            break;
        }
    }
    if (!endIndex) {
        throw "Invalid data. 'e' symbol expected";
    }
    return {
        value: parseInt(data.slice(1, endIndex).toString()),
        rest: data.slice(endIndex + 1)
    };
}
exports.decodeInteger = decodeInteger;
function decodeList(data) {
    // TODO: Check for 'e' symbol in the end.
    var result = [];
    var rest = data.slice(1); // l...
    var value = null;
    while (rest) {
        var firstByte = rest[0];
        if (firstByte === Delimeters.i) {
            (_a = decodeInteger(rest), value = _a.value, rest = _a.rest, _a);
            result.push(value);
        }
        if (encodesDigit(firstByte)) {
            (_b = decodeString(rest), value = _b.value, rest = _b.rest, _b);
            result.push(value);
        }
        if (firstByte === Delimeters.l) {
            (_c = decodeList(rest), value = _c.value, rest = _c.rest, _c);
            result.push(value);
        }
        if (firstByte === Delimeters.e) {
            rest = rest.slice(1);
            break;
        }
    }
    return { value: result, rest: rest };
    var _a, _b, _c;
}
exports.decodeList = decodeList;
function decodeDict(data) {
    var result = {};
    var rest = data.slice(1); // d...
    var value = null;
    var key;
    while (rest.length !== 0) {
        console.log(rest.toString());
        var firstByte = rest[0];
        if (firstByte === Delimeters.e) {
            rest = rest.slice(1);
            break;
        }
        (_a = decodeString(rest), key = _a.value, rest = _a.rest, _a);
        (_b = _decode(rest), value = _b.value, rest = _b.rest, _b);
        result[key] = value;
    }
    return { value: result, rest: rest };
    var _a, _b;
}
exports.decodeDict = decodeDict;
function encodesDigit(x) {
    return (x >= 0x30) && (x <= 0x39);
}
function _decode(data) {
    var value = null;
    var rest = null;
    var firstByte = data[0];
    if (firstByte === Delimeters.i) {
        return decodeInteger(data);
    }
    if (encodesDigit(firstByte)) {
        return decodeString(data);
    }
    else if (firstByte === Delimeters.l) {
        return decodeList(data);
    }
    else if (firstByte === Delimeters.d) {
        return decodeDict(data);
    }
}
/**
 * Decodes bencoded data.
 *
 * @param {Buffer} data
 * @param {String} encoding (optional)
 * @return {Object|Array|String|Number}
 */
function decode(data, encoding) {
    return _decode(data).value;
}
exports.decode = decode;
//# sourceMappingURL=bencoder.js.map