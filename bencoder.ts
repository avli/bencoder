'use strict';

import {Buffer} from 'buffer';

/*
Encoding
*/

function encodeString(s: string): string {
    return s.length + ':' + s;
}

function encodeInteger(i: number): string {
    return 'i' + i + 'e';
}

function encodeArray(l: Array<any>): string {
    let result = 'l';
    l.forEach(element => {
        result += _encode(element)
    });
    return result + 'e';
}

function encodeDict(d: any): string {
    let result = 'd';
    let keys = Object.keys(d).sort();
    keys.forEach(k => {
        result += (encodeString(k) + _encode(d[k]));
    });
    return result + 'e';
}

function isArray(obj: any): boolean {
    if (typeof obj === 'object') {
        return obj.constructor === Array ? true : false;
    }
    return false;
}

function _encode(data: any): string {
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