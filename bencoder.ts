'use strict';

export class Bencoder {

    public encodeString(s: string): string {
        return s.length + ':' + s;
    }

    public encodeInteger(i: number): string {
        return 'i' + i + 'e';
    }

    public encodeArray(l: Array<any>): string {
        let result = 'l';
        l.forEach(element => {
            result += this.encode(element)
        });
        return result + 'e';
    }

    public encodeDict(d: any): string {
        let result = 'd';
        let keys = Object.keys(d).sort();
        keys.forEach(k => {
            result += (this.encodeString(k) + this.encode(d[k]));
        });
        return result + 'e';
    }

    private isArray(obj: any): boolean {
        if (typeof obj === 'object') {
            return obj.constructor === Array ? true : false;
        }
        return false;
    }

    private encode(data: any): string {
        switch (typeof data) {
            case 'string':
                return this.encodeString(data);
            case 'number':
                return this.encodeInteger(data);
            case 'object':
                if (this.isArray(data)) {
                    return this.encodeArray(data);
                }
                else {
                    return this.encodeDict(data);
                }
        }
    }
}