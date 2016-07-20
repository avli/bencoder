'use strict';

import * as assert from 'assert';
import {Buffer} from 'buffer';
import * as bencoder from '../bencoder'

describe('bencoder', () => {
    describe('#encode()', () => {
        it('should encode "foo" to "3:foo"', () => {
            assert.equal("3:foo", bencoder.encode('foo').toString());
        });
        it('should encode an empty string to "0:"', () => {
            assert.equal("0:", bencoder.encode('').toString());
        });
        it('should encode 42 to "i42e"', () => {
            assert.equal("i42e", bencoder.encode(42).toString());
        });
        it('should encode [1, 2, 3] to "li1ei2ei3ee"', () => {
            assert.equal("li1ei2ei3ee", bencoder.encode([1,2,3]).toString());
        });
        it('should encode [1, "2", "foo", 42] to li1e1:23:fooi42ee', () => {
            assert.equal("li1e1:23:fooi42ee", bencoder.encode([1, "2", "foo", 42]).toString());
        });
        it('should encode {"a": 1, "b": 2, 3: 42} to d1:3i42e1:ai1e1:bi2ee', () => {
            assert.equal("d1:3i42e1:ai1e1:bi2ee", bencoder.encode({"a": 1, "b": 2, 3: 42}).toString());
        });
        it('should encode {"list": [1, 2, 3]} to "d4:listli1ei2ei3eee"', () => {
            assert.equal("d4:listli1ei2ei3eee", bencoder.encode({"list": [1, 2, 3]}).toString());
        });
        it('should encode [{d1: {a: 1}}, {d2: {b: 2}}] to "ld2:d1d1:ai1eed2:d2d1:bi2eeee"', () => {
            assert.equal("ld2:d1d1:ai1eeed2:d2d1:bi2eeee", bencoder.encode([{d1: {a: 1}}, {d2: {b: 2}}]).toString());
        });
    });

    describe('#decode()', () => {
        it('should dencode "3:foo" to "foo"', () => {
            assert.equal('foo', bencoder.decode(Buffer.from('3:foo')).toString());
        });
        it('should raise exception when decoding "3:foobar"', () => {
            assert.throws(() => {
                bencoder.decode(Buffer.from('3:foobar'))
            }, 
            Error);
        });
        // it('should decode "li1ei2e5:threee" to [1, 2, "three"]', () => {
        //     assert.equal([1, 2, "three"], bencoder.decode(Buffer.from("li1ei2e5:threee")));
        // })
    });

    describe('#decodeString()', () => {
        it('should raise exception when decoding "3foo"', () => {
            assert.throws(() => {
                bencoder.decode(Buffer.from('3foo'))
            }, 
            Error);
        });
    })

    describe('#decodeInteger()', () => {
        it('should raise exception when decoding "i42"', () => {
            assert.throws(() => {
                bencoder.decode(Buffer.from('i42'))
            }, 
            Error);
        });
    })
})

