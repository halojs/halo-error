'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValidationError = undefined;
exports.default = error;

var _koaOnerror = require('koa-onerror');

var _koaOnerror2 = _interopRequireDefault(_koaOnerror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function error(options = {}) {
    let isMountedErrorHandler = false;

    return async function _error(ctx, next) {
        if (!isMountedErrorHandler) {
            (0, _koaOnerror2.default)(ctx.app, options);
            isMountedErrorHandler = true;
        }

        try {
            await next();
        } catch (err) {
            if (err instanceof ValidationError) {
                ctx.status = 422;
                ctx.body = { message: err.name, errors: [err.message] };
            } else {
                throw err;
            }
        }
    };
}

class ValidationError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.name = 'Validation Failed';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ValidationError = ValidationError;