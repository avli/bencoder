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
function _encode(data) {
    switch (typeof data) {
        case 'string':
            return encodeString(data);
        case 'number':
            return encodeInteger(data);
        case 'object':
            if (Array.isArray(data)) {
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
    if (!firstColonIndex) {
        throw new Error("Error while decoding " + data.toString() + ". Missing colon.");
    }
    var expectedLength = parseInt(data.slice(0, firstColonIndex).toString());
    var value = data.slice(firstColonIndex + 1, firstColonIndex + 1 + expectedLength);
    return { value: value.toString(encoding), rest: data.slice(firstColonIndex + 1 + expectedLength) };
}
function decodeInteger(data) {
    var endIndex = null; // The first 'e' symbol index
    for (var i = 1; i < data.length; i++) {
        if (data[i] === Delimeters.e) {
            endIndex = i;
            break;
        }
    }
    if (!endIndex) {
        throw new Error("Invalid data. 'e' symbol expected");
    }
    return {
        value: parseInt(data.slice(1, endIndex).toString()),
        rest: data.slice(endIndex + 1)
    };
}
function decodeList(data) {
    // TODO: Check for 'e' symbol in the end.
    var result = [];
    var rest = data.slice(1); // l...
    var value = null;
    while (true) {
        var firstByte = rest[0];
        if (firstByte === Delimeters.i) {
            (_a = decodeInteger(rest), value = _a.value, rest = _a.rest, _a);
            result.push(value);
            continue;
        }
        if (encodesDigit(firstByte)) {
            (_b = decodeString(rest), value = _b.value, rest = _b.rest, _b);
            result.push(value);
            continue;
        }
        if (firstByte === Delimeters.l) {
            (_c = decodeList(rest), value = _c.value, rest = _c.rest, _c);
            result.push(value);
            continue;
        }
        if (firstByte === Delimeters.e) {
            rest = rest.slice(1);
            break;
        }
        throw new Error("Expected d, i, l or digit, got " + rest.toString());
    }
    return { value: result, rest: rest };
    var _a, _b, _c;
}
function decodeDict(data) {
    var result = {};
    var rest = data.slice(1); // d...
    var value = null;
    var key;
    while (rest.length !== 0) {
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
    else if (encodesDigit(firstByte)) {
        return decodeString(data);
    }
    else if (firstByte === Delimeters.l) {
        return decodeList(data);
    }
    else if (firstByte === Delimeters.d) {
        return decodeDict(data);
    }
    else {
        throw new Error("Expected d, i, l or digit, got \"" + data.toString() + "\"");
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
    var value;
    var rest;
    (_a = _decode(data), value = _a.value, rest = _a.rest, _a);
    if (rest.length) {
        throw new Error("Unexpected continuation: \"" + rest.toString() + "\"");
    }
    return value;
    var _a;
}
exports.decode = decode;
//# sourceMappingURL=bencoder.js.map