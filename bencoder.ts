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

export function decodeString(data: Buffer, encoding?: string): string {
    let firstColonIndex = null;
    for(let i = 0; i < data.length; i++) {
        if (data[i] === 0x3a) {
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

export function decodeInteger(data: Buffer): number {
    let value = data.slice(1, data.length - 1);
    return parseInt(value.toString());
}

function encodesDigit(x: number) {
    return (x >= 0x30) && (x <= 0x39);
}

export function decode(data: Buffer, encoding?: string): any {
    let result = null;
    data.forEach(x => {
        if (x === 0x69) { // i
            result = decodeInteger(data);
        }
        else if (encodesDigit(x)) {
            result = decodeString(data);      
        }
    });
    return result;
}