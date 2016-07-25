# Bencode

[![Build Status](https://travis-ci.org/avli/bencoder.svg?branch=master)](https://travis-ci.org/avli/bencoder)

A [Bencode](https://en.wikipedia.org/wiki/Bencode) encoding/decoding library written in TypeScript.

# Usage

```javascript
Bencoder = require('bencoder')

// Encode data

var x1 = Bencoder.encode("foobar")
var x2 = Bencoder.encode(42)
var x3 = Bencoder.encode({foo: [1, 2, 3], bar: 42, baz: "foobarbaz"})

// x1, x2, and x3 are Buffer objects. For example x1 is actually <Buffer 36 3a 66 6f 6f 62 61 72>
// To see the string representation do

x1.toString()
'6:foobar'

x2.toString()
'i42e'

x3.toString()
'd3:bari42e3:baz9:foobarbaz3:food1:0i1e1:1i2e1:2i3eee'

// Decode data

Bencoder.decode(x1)
'foobar'
Bencoder.decode(x2)
42
Bencoder.decode(x3)
{ bar: 42, baz: 'foobarbaz', foo: [ 1, 2, 3 ] }

// A few words about encodings
// By default bencoder assumes everything is UTF-8. For example

var x4 = Bencoder.encode('привет')
Bencoder.decode(x4) // which is the same as Bencoder.decode(x4, 'utf8')
'привет'

// Or you can specify another encoding, if you want to
Bencoder.decode(x4, 'ascii')
'P?Q\u0000P8P2P5Q\u0002' 

```

