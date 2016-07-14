var assert = require('assert');
var bencoder = require('../out/bencoder')

describe('bencoder', function() {
    describe('#encode()', function() {
        it('should encode "foo" to "3:foo"', function () {
            assert.equal("3:foo", bencoder.encode('foo').toString());
        });
        it('should encode an empty string to "0:"', function () {
            assert.equal("0:", bencoder.encode('').toString());
        });
        it('should encode 42 to "i42e"', function () {
            assert.equal("i42e", bencoder.encode(42).toString());
        });
    });

    describe('#decode()', function() {
        it('should dencode "3:foo" to "foo"', function () {
            assert.equal('foo', bencoder.decode(Buffer.from('3:foo')).toString());
        });
        it('should raise exception when decoding "3:foobar"', function () {
            assert.throws(() => {
                bencoder.decode(Buffer.from('3:foobar')).toString()
            }, 
            Error);
        });
    });
})

