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

export function encode(data: string): Buffer {
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

export function decodeString(data: Buffer, encoding?: string): string {
    let firstColonIndex = null;
    for(let i = 0; i < data.length; i++) {
        if (data[i] === Delimeters.colon) {
            firstColonIndex = i;
            break;
        }
    }

    // TODO: Make the message more meaningful.
    if (!firstColonIndex) {
        throw "Invalid data. Missing colon.";
    }

    let expectedLength = parseInt(data.slice(0,firstColonIndex).toString());
    let value = data.slice(firstColonIndex + 1, data.length);

    // TODO: Make the message more meaningful.
    if (expectedLength !== value.length) {
        throw "Invalid data. String length is not equal the expected one.";
    }
    else {
        return value.toString(encoding);
    }
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
        throw "Invalid data. 'e' symbol expected";
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
        if (firstByte === Delimeters.i) { // i
            ({value, rest} = decodeInteger(rest));
            result.push(value);
        }
        if (firstByte === Delimeters.e) { // end of the list
            rest = rest.slice(1);
            break;
        }
    }

    return {value: result, rest: rest};
}

function encodesDigit(x: number) {
    return (x >= 0x30) && (x <= 0x39);
}

function _decode(data: Buffer, topLevel?: boolean): any {
    let rest = data;
    let value = null;
    while (rest) {
        let firstByte = rest[0];
        if (firstByte === Delimeters.i) {
            ({value, rest} = decodeInteger(data));
            if ((topLevel) && (rest.length !== 0)) {
                throw 'Incorrect data. Unexpected continuation.'
            }
        }
        else if (encodesDigit(firstByte)) {
            return decodeString(data);
        }
        else if (firstByte === Delimeters.l) {
            ({value, rest} = decodeList(data));
            if ((topLevel) && (rest.length !== 0)) {
                throw 'Incorrect data. Unexpected continuation.'
            }
        }
        else {
            throw `Incorrect data. Expected 'd', 'i', 'l', or digit, got ${rest[0]}.`
        }
    }
    return value;
}

export function decode(data: Buffer, encoding?: string): any {
    return _decode(data, true);
}