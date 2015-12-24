'use strict';
module.exports = generate(0);
module.exports.reject = generate(1);

function generate(argIndex) {
	return function (ms, value) {
		ms = ms || 0;
		var useValue = arguments.length > 1;

		var promise = null;

		function thunk(result) {
			// attach error handler so we don't get `unhandledRejection` errors if they only use the thunk.
			if (promise) {
				promise.catch(function () {});
			}

			return new Promise(function (resolve, reject) {
				var complete = argIndex ? reject : resolve;
				setTimeout(function () {
					complete(useValue ? value : result);
				}, ms);
			});
		}

		promise = thunk(value);

		thunk.then = promise.then.bind(promise);
		thunk.catch = promise.catch.bind(promise);

		return thunk;
	};
}
