'use strict';

import {Buffer} from 'buffer';

/*
Encoding
*/

function encodeString(s: string): Buffer {
    let bytes = Buffer.from(s);
    return Buffer.concat([
        Buffer.from(bytes.length.toString()),
        Buffer.from(':'),
        bytes]);
}

function encodeInteger(i: number): Buffer {
    return Buffer.from(`i${i}e`);
}

function encodeArray(l: Array<any>): Buffer {
    let result: Array<Buffer> = [Buffer.from('l')];
    l.forEach(element => {
        result.push(_encode(element));
    });
    result.push(Buffer.from('e'))
    return Buffer.concat(result);
}

function encodeDict(d: any): Buffer {
    let result: Array<Buffer> = [Buffer.from('d')];
    let keys = Object.keys(d).sort();
    keys.forEach(k => {
        result.push(encodeString(k));
        result.push(encode(d[k]))
    });
    result.push(Buffer.from('e'));
    return Buffer.concat(result);
}

function isArray(obj: any): boolean {
    if (typeof obj === 'object') {
        return obj.constructor === Array ? true : false;
    }
    return false;
}

function _encode(data: any): Buffer {
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
export function encode(data: any): Buffer {
    return new Buffer(_encode(data));
}

/*
Decoding
*/

enum Delimeters {
    i = 0x69,
    e = 0x65,
    l = 0x6c,
    d = 0x64,
    colon = 0x3a
}

interface DecodingResult {
    value: any,
    rest?: Buffer
}

export function decodeString(data: Buffer, encoding?: string): DecodingResult {
    let firstColonIndex = null;
    for(let i = 0; i < data.length; i++) {
        if (data[i] === Delimeters.colon) {
            firstColonIndex = i;
            break;
        }
    }

    if (!firstColonIndex) {
        throw new Error(`Error while decoding ${data.toString()}. Missing colon.`);
    }

    let expectedLength = parseInt(data.slice(0,firstColonIndex).toString());
    let value = data.slice(firstColonIndex + 1, firstColonIndex + 1 + expectedLength);
    return {value: value.toString(encoding), rest: data.slice(firstColonIndex + 1 + expectedLength)}
}

export function decodeInteger(data: Buffer): DecodingResult {
    let endIndex: number = null // The first 'e' symbol index
    for (let i = 1; i < data.length; i++) {
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
    }
}

export function decodeList(data: Buffer): DecodingResult {
    // TODO: Check for 'e' symbol in the end.
    let result = [];
    let rest = data.slice(1); // l...
    let value = null;

    while (rest) {
        let firstByte = rest[0];
        if (firstByte === Delimeters.i) {
            ({value, rest} = decodeInteger(rest));
            result.push(value);
        }
        if (encodesDigit(firstByte)) {
            ({value, rest} = decodeString(rest));
            result.push(value);
        }
        if (firstByte === Delimeters.l) {
            ({value, rest} = decodeList(rest));
            result.push(value);
        }
        if (firstByte === Delimeters.e) { // end of the list
            rest = rest.slice(1);
            break;
        }
    }

    return {value: result, rest: rest};
}

export function decodeDict(data: Buffer): DecodingResult {
    let result = {};
    let rest = data.slice(1); // d...
    let value = null;
    let key: string;

    while (rest.length !== 0) {
        console.log(rest.toString());
        let firstByte = rest[0];
        if (firstByte === Delimeters.e) {
            rest = rest.slice(1);
            break;
        }
        ({value: key, rest} = decodeString(rest));
        ({value, rest} = _decode(rest));
        result[key] = value;
    }

    return {value: result, rest: rest}
}

function encodesDigit(x: number) {
    return (x >= 0x30) && (x <= 0x39);
}

function _decode(data: Buffer): any {
    let value = null;
    let rest = null;
    let firstByte = data[0];
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
export function decode(data: Buffer, encoding?: string): any {
    return _decode(data).value;
}