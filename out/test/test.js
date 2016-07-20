'use strict';
var assert = require('assert');
var buffer_1 = require('buffer');
var bencoder = require('../bencoder');
describe('bencoder', function () {
    describe('#encode()', function () {
        it('should encode "foo" to "3:foo"', function () {
            assert.equal("3:foo", bencoder.encode('foo').toString());
        });
        it('should encode an empty string to "0:"', function () {
            assert.equal("0:", bencoder.encode('').toString());
        });
        it('should encode 42 to "i42e"', function () {
            assert.equal("i42e", bencoder.encode(42).toString());
        });
        it('should encode [1, 2, 3] to "li1ei2ei3ee"', function () {
            assert.equal("li1ei2ei3ee", bencoder.encode([1, 2, 3]).toString());
        });
        it('should encode [1, "2", "foo", 42] to li1e1:23:fooi42ee', function () {
            assert.equal("li1e1:23:fooi42ee", bencoder.encode([1, "2", "foo", 42]).toString());
        });
        it('should encode {"a": 1, "b": 2, 3: 42} to d1:3i42e1:ai1e1:bi2ee', function () {
            assert.equal("d1:3i42e1:ai1e1:bi2ee", bencoder.encode({ "a": 1, "b": 2, 3: 42 }).toString());
        });
        it('should encode {"list": [1, 2, 3]} to "d4:listli1ei2ei3eee"', function () {
            assert.equal("d4:listli1ei2ei3eee", bencoder.encode({ "list": [1, 2, 3] }).toString());
        });
        it('should encode [{d1: {a: 1}}, {d2: {b: 2}}] to "ld2:d1d1:ai1eed2:d2d1:bi2eeee"', function () {
            assert.equal("ld2:d1d1:ai1eeed2:d2d1:bi2eeee", bencoder.encode([{ d1: { a: 1 } }, { d2: { b: 2 } }]).toString());
        });
        it('should encode {foo: [1, 2, 3], bar: 42, baz: "foobarbaz"} to "d3:bari42e3:baz9:foobarbaz3:fooli1ei2ei3eee"', function () {
            assert.deepEqual("d3:bari42e3:baz9:foobarbaz3:fooli1ei2ei3eee", bencoder.encode({ foo: [1, 2, 3], bar: 42, baz: "foobarbaz" }).toString());
        });
    });
    describe('#decode()', function () {
        it('should dencode "3:foo" to "foo"', function () {
            assert.equal('foo', bencoder.decode(buffer_1.Buffer.from('3:foo')).toString());
        });
        it('should decode "li1ei2e5:threee" to [1, 2, "three"]', function () {
            assert.deepEqual([1, 2, "three"], bencoder.decode(buffer_1.Buffer.from("li1ei2e5:threee")));
        });
        it('should raise exception when decoding "li42eee"', function () {
            assert.throws(function () {
                bencoder.decode(buffer_1.Buffer.from("li42eee"));
            }, function (err) {
                return err.message === 'Unexpected continuation: "e"';
            });
        });
        it('should raise exception when decoding "li42e"', function () {
            assert.throws(function () {
                bencoder.decode(buffer_1.Buffer.from("li42e"));
            });
        });
        it('should decode "d1:ai1e3:fooi42e" to {a: 1, foo: 42}', function () {
            assert.deepEqual({ a: 1, 'foo': 42 }, bencoder.decode(buffer_1.Buffer.from("d1:ai1e3:fooi42e")));
        });
        it('should decode "d3:food3:bar3:bazee" to {foo: {bar: "baz"}}', function () {
            assert.deepEqual({ foo: { bar: "baz" } }, bencoder.decode(buffer_1.Buffer.from("d3:food3:bar3:bazee")));
        });
        it('it should raise exception when decoding "d3:food3bar3:bazee"', function () {
            assert.throws(function () {
                bencoder.decode(buffer_1.Buffer.from("d3:food3bar3:bazee"));
            }, function (err) {
                assert.equal(err.message, "Expected d, i, l or digit, got \"ee\"");
                return true;
            });
        });
    });
    describe('#decodeString()', function () {
        it('should raise exception when decoding "3foo"', function () {
            assert.throws(function () {
                bencoder.decode(buffer_1.Buffer.from('3foo'));
            }, Error);
        });
    });
    describe('#decodeInteger()', function () {
        it('should raise exception when decoding "i42"', function () {
            assert.throws(function () {
                bencoder.decode(buffer_1.Buffer.from('i42'));
            }, Error);
        });
    });
});
//# sourceMappingURL=test.js.map