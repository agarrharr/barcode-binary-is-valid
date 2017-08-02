# barcode-binary-is-valid

[![Build Status](https://travis-ci.org/agarrharr/barcode-binary-is-valid.svg?branch=master)](https://travis-ci.org/agarrharr/barcode-binary-is-valid)

## Install

```
$ npm install --save barcode-binary-is-valid
```

## Usage

```js
const barcodeBinaryIsValid = require('barcode-binary-is-valid');

barcodeBinaryIsValid('10100011010110001001100100011010001101000110101010111001011001101101100100111011001101000100101')
//=> true

barcodeBinaryIsValid('10110011')
//=> {
	success: false,
	message: 'Incorrect length: Should have 95 bits'
	code: 'LENGTH',
}
```

## API

### barcodeBinaryIsValid(bars)

Returns barcode in binary

#### bars

Type: `string`

A string of the barcode where each bar and gap is represented by one number between 1 and 4 depending on its width.

## License

MIT
