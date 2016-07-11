'use strict';

function encodeString(s: string): string {
    return s.length + ':' + s;
}

function decodeString(data: string): string {
    return ''; 
}

function encodeInteger(i: number): string {
    return 'i' + i + 'e';
}

function encodeArray(l: Array<any>): string {
    let result = 'l';
    l.forEach(element => {
        result += encode(element)
    });
    return result + 'e';
}

function encodeDict(d: any): string {
    let result = 'd';
    let keys = Object.keys(d).sort();
    keys.forEach(k => {
        result += (encodeString(k) + encode(d[k]));
    });
    return result + 'e';
}

function isArray(obj: any): boolean {
    if (typeof obj === 'object') {
        return obj.constructor === Array ? true : false;
    }
    return false;
}

export function encode(data: any): string {
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