'use strict';

const htmlEscapeObject = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', };
const htmlEscapeRegExp = new RegExp('['+ Object.keys(htmlEscapeObject).join('') +']', 'g');
const escapeHtml = exports.escapeHtml = string =>
	String.prototype.replace.call(string != null ? string : '', htmlEscapeRegExp, c => htmlEscapeObject[c]);

const escapeString = exports.escapeString = string =>
	String.prototype.replace.call(string != null ? string : '', /([\\\n\$\`\'\"])/g, '\\$1');

const trim = exports.trim = string => String.prototype.replace.call(string != null ? string : '', (/[ \t\v\n\s]+/g), ' ');

const unescapeUrl = exports.unescapeUrl = string => decodeURI(string).replace(/\+/g, ' ');

const toString = any => {
	if (/^(boolean|number|string|function|symbol)$/.test(typeof any)) { return any; }
	if (any === undefined) { return ''; }
	if (Array.isArray(any)) { return any.map(toString).join(', '); }
	const string = any +'';
	if (/^\[object \w+?\]$/.test(string)) { try {
		return JSON.stringify(any);
	} catch (e) { } }
	return string;
};