/** @problem избавляет от try/catch
 * @example {
 * const to = require("./to")
 * async fn bar(){}
 * const [err, quote] =  await to bar()
 * }
 * @param { Promise } promise
 * @return { err, undefined }
 */
export const to = (promise) => {
	return promise
		.then(function (data) {
			return [null, data];
		})
		.catch(function (err) {
			return [ err, undefined];
		});
};