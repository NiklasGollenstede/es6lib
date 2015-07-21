(function firefox(exports) { 'use strict';

const escape = require('./template/escape.js');
const escapeString = escape.escapeString;
const trim = escape.trim;


const runInTab = exports.runInTab = function(tab, script) {
	return new Promise((resolve, reject) => {
		const worker = tab.attach({
			contentScript: (`
const onError = error => {
	try {
		unsafeWindow.console.error('error', error);
	} catch (e) { }
	if (error instanceof Error) {
		error.json = [ 'columnNumber', 'fileName', 'lineNumber', 'message', 'stack', ]
		.reduce((json, key) => ((json[key] = error[key]), json), { });
	}
	self.port.emit("reject", error);
};
try {
	Promise.resolve(
		new Function(
			"return (${
				escapeString(trim(
					String.replace(script, (/\/\/(.*)$/gm), ' /*$1*/ ')
				))
			})();"
		)()
	).then(value => self.port.emit("resolve", value))
	.catch(onError);
} catch(error) {
	onError(error);
}`			),
		});
		worker.port.on("resolve", value => {
			worker.destroy();
			resolve(value);
		});
		worker.port.on("reject", value => {
			worker.destroy();
			reject(value);
		});
	});
};

const moduleName = 'es6lib/firefox'; if (typeof module !== 'undefined') { module.exports = exports; } else if (typeof define === 'function') { define(moduleName, exports); } else if (typeof window !== 'undefined' && typeof module === 'undefined') { window[moduleName] = exports; } return exports; })({ });