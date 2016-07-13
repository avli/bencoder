'use strict';

import {Buffer} from 'buffer';

/*
Encoding
*/

function encodeString(s: string): Buffer {
    return Buffer.from(`${s.length}:${s}`);
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

function decodeString(data: string): string {
    let m = data.match(/^(d+)\:(.+)/);
    return m ? m[2] : '';
}

export function decode(data: Buffer, encoding?: string): any {
    let s = data.toString(encoding || null);

    if (!s) return null;

    let firstChar: string = s[0];

    for(let i = 0; i < s.length; i++) {
        ;
    }
}