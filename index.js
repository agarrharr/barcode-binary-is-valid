'use strict';

const ERROR = {
	LENGTH: {
		code: 'LENGTH',
		message: 'Incorrect length: Should have 95 bits'
	},
	LEFT_GUARD: {
		code: 'LEFT_GUARD',
		message: 'Missing left guard: Should start with 101'
	},
	RIGHT_GUARD: {
		code: 'RIGHT_GUARD',
		message: 'Missing right guard: Should end with 101'
	},
	CENTER_GUARD: {
		code: 'CENTER_GUARD',
		message: 'Missing center guard: Should have 01010 in the middle'
	}
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

const getError = error => ({
	success: false,
	message: error.message,
	code: error.code
});

module.exports = binary => {
	// Should have 95 bits
	if (binary.length !== 95) {
		return getError(ERROR.LENGTH);
	}
	// Left-hand guard pattern
	if (binary.slice(0, 3) !== '101') {
		return getError(ERROR.LEFT_GUARD);
	}
	// Right-hand guard pattern
	if (binary.slice(-3) !== '101') {
		return getError(ERROR.RIGHT_GUARD);
	}
	// Center guard pattern
	if (binary.slice(45, 50) !== '01010') {
		return getError(ERROR.CENTER_GUARD);
	}
	const withoutGuards = binary.slice(3, 45).concat(binary.slice(50, 92));
	const numbers = withoutGuards.match(/.{7}/g);
	if (numbers.length !== 12) {
		return false;
	}
	const isBackwards = rightSideCodes.includes(numbers[0]);
	for (let i = 0; i < 6; i++) {
		const codes = isBackwards ? rightSideCodes : leftSideCodes;
		if (!codes.includes(numbers[i])) {
			return false;
		}
	}
	for (let i = 6; i < 12; i++) {
		const codes = isBackwards ? leftSideCodes : rightSideCodes;
		if (!codes.includes(numbers[i])) {
			return false;
		}
	}
	return true;
};
