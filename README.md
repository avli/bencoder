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
Bencoder.decode(x2)
Bencoder.decode(x3)

```

