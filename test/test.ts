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
    });

    describe('#decode()', () => {
        it('should dencode "3:foo" to "foo"', () => {
            assert.equal('foo', bencoder.decode(Buffer.from('3:foo')).toString());
        });
        it('should raise exception when decoding "3:foobar"', () => {
            assert.throws(() => {
                bencoder.decode(Buffer.from('3:foobar')).toString()
            }, 
            Error);
        });
    });
})

