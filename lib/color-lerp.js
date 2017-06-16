'use strict';
var Color = require('color');
var lerp = require('lerp');
var result = require('lodash/result');
var identity = require('lodash/identity');
var isString = require('lodash/isString');
var isNumber = require('lodash/isNumber');
var range = require('lodash/range');
var map = require('lodash/map');

function getColorString (color, key) {
	switch (key) {
		case 'hex':
			return result(color, 'hexString');
		case 'rgb':
			return result(color, 'rgbString');
		case 'rgba':
			return result(color, 'rgbaString');
		case 'percent':
			return result(color, 'percentString');
		case '%':
			return result(color, 'percentString');
		case 'hsl':
			return result(color, 'hslString');
		case 'hsla':
			return result(color, 'hslaString');
		case 'hwb':
			return result(color, 'hwbString');
		case 'color':
			return identity(color);
	}
}

function lerpColors (color1, color2, weight) {
	return Color({
		h: lerp(color1.hue(), color2.hue(), weight),
		s: lerp(color1.saturation(), color2.saturation(), weight),
		l: lerp(color1.lightness(), color2.lightness(), weight),
		a: lerp(color1.alpha(), color2.alpha(), weight)
	});
}

module.exports = function (color1, color2, steps, format) {
	if (!isString(color1)) {
		throw new Error('Expected color1 to be a String.');
	}
	if (!isString(color2)) {
		throw new Error('Expected color2 to be a String.');
	}
	if (!isNumber(steps)) {
		throw new Error('Expected steps to be a Number.');
	}
	steps = Math.floor(steps);
	if (steps < 2) {
		throw new Error('Expected steps to be at least 2.');
	}
	if (!isString(format)) {
		format = 'hsl';
	}
	color1 = Color(color1);
	color2 = Color(color2);
	return map(map(map(range(0, steps), function (value) {
		var weight = value / (steps - 1);
		return weight;
	}), function (weight) {
		return lerpColors(color1, color2, weight);
	}), function (color) {
		return getColorString(color, format.toLowerCase());
	});
};
