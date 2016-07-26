/**
 * Encodes data in bencode.
 *
 * @param {Array|String|Object|Number} data
 * @return {Buffer}
 */
export declare function encode(data: any): Buffer;
/**
 * Decodes bencoded data.
 *
 * @param {Buffer} data
 * @param {String} encoding (optional)
 * @return {Object|Array|String|Number}
 */
export declare function decode(data: Buffer, encoding?: string): any;
