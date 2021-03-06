'use strict';
const barcodeGetBinarySections = require('barcode-get-binary-sections');
const barcodeConvertNumber = require('barcode-convert-number');

const errorMessages = {
	LENGTH: () => `Incorrect length: Should have 95 bits`,
	LEFT_GUARD: () => `Missing left guard: Should start with 101`,
	RIGHT_GUARD: () => `Missing right guard: Should end with 101`,
	CENTER_GUARD: () => `Missing center guard: Should have 01010 in the middle`,
	INCORRECT_NUMBER: info => `Incorrect number: the number at position ${info.index} (${info.number}) is not a valid number`,
	INCORRECT_MODULO: () => `Incorrect modulo: The module character doesn't match. The UPC isn't valid.`
};

const leftSideCodes = [
	'0001101',
	'0011001',
	'0010011',
	'0111101',
	'0100011',
	'0110001',
	'0101111',
	'0111011',
	'0110111',
	'0001011'
];

const rightSideCodes = [
	'1110010',
	'1100110',
	'1101100',
	'1000010',
	'1011100',
	'1001110',
	'1010000',
	'1000100',
	'1001000',
	'1110100'
];

const ERRORS = Object.keys(errorMessages).reduce((a, key) => Object.assign(a, {[key]: key}), {});

const getError = (type, info) => ({
	success: false,
	message: errorMessages[type](info),
	code: type
});

const moduloEquation = n => 3 * (n[0] + n[2] + n[4] + n[6] + n[8] + n[10]) + (n[1] + n[3] + n[5] + n[7] + n[9]);
const roundUpTen = a => (Math.floor(a / 10) + 1) * 10;

const checkModulo = barcode => {
	const n = [...barcode.leftNumbers.map(d => barcodeConvertNumber(d)), ...barcode.rightNumbers.map(d => barcodeConvertNumber(d))];
	const modulo = n[11];
	const result = moduloEquation(n);
	return (modulo === (roundUpTen(result) - result)) ||
		getError(ERRORS.INCORRECT_MODULO);
};

const binary = string => {
	const barcode = barcodeGetBinarySections(string);
	if (string.length !== 95) {
		return getError(ERRORS.LENGTH);
	}
	if (barcode.leftHandGuard !== '101') {
		return getError(ERRORS.LEFT_GUARD);
	}
	if (barcode.rightHandGuard !== '101') {
		return getError(ERRORS.RIGHT_GUARD);
	}
	if (barcode.centerGuard !== '01010') {
		return getError(ERRORS.CENTER_GUARD);
	}
	for (let i = 0; i < barcode.leftNumbers.length; i++) {
		const codes = barcode.isBackwards ? rightSideCodes : leftSideCodes;
		if (!codes.includes(barcode.leftNumbers[i])) {
			return getError(ERRORS.INCORRECT_NUMBER, {index: i, number: barcode.leftNumbers[i]});
		}
	}
	for (let i = 0; i < barcode.rightNumbers.length; i++) {
		const codes = barcode.isBackwards ? leftSideCodes : rightSideCodes;
		if (!codes.includes(barcode.rightNumbers[i])) {
			return getError(ERRORS.INCORRECT_NUMBER, {index: i, number: barcode.rightNumbers[i]});
		}
	}
	return checkModulo(barcode);
};

module.exports = string => binary(string);
