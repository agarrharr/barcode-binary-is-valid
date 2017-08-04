'use strict';

const errorMessages = {
	LENGTH: () => `Incorrect length: Should have 95 bits`,
	LEFT_GUARD: () => `Missing left guard: Should start with 101`,
	RIGHT_GUARD: () => `Missing right guard: Should end with 101`,
	CENTER_GUARD: () => `Missing center guard: Should have 01010 in the middle`,
	INCORRECT_NUMBER: info => `Incorrect number: the number at position ${info.index} (${info.number}) is not a valid number`
};

const ERRORS = Object.keys(errorMessages).reduce((a, key) => Object.assign(a, {[key]: key}), {});

const getError = (type, info) => ({
	success: false,
	message: errorMessages[type](info),
	code: type
});

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

const binary = string => {
	// Should have 95 bits
	if (string.length !== 95) {
		return getError(ERRORS.LENGTH);
	}
	// Left-hand guard pattern
	if (string.slice(0, 3) !== '101') {
		return getError(ERRORS.LEFT_GUARD);
	}
	// Right-hand guard pattern
	if (string.slice(-3) !== '101') {
		return getError(ERRORS.RIGHT_GUARD);
	}
	// Center guard pattern
	if (string.slice(45, 50) !== '01010') {
		return getError(ERRORS.CENTER_GUARD);
	}
	const withoutGuards = string.slice(3, 45).concat(string.slice(50, 92));
	const numbers = withoutGuards.match(/.{7}/g);
	const isBackwards = rightSideCodes.includes(numbers[0]);
	for (let i = 0; i < 6; i++) {
		const codes = isBackwards ? rightSideCodes : leftSideCodes;
		if (!codes.includes(numbers[i])) {
			return getError(ERRORS.INCORRECT_NUMBER, {index: i, number: numbers[i]});
		}
	}
	for (let i = 6; i < 12; i++) {
		const codes = isBackwards ? leftSideCodes : rightSideCodes;
		if (!codes.includes(numbers[i])) {
			return getError(ERRORS.INCORRECT_NUMBER, {index: i, number: numbers[i]});
		}
	}
	return true;
};

module.exports = string => binary(string);
