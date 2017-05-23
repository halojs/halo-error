'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValidError = exports.ResourcesFailureError = exports.ResourcesExistError = exports.NetworkError = exports.ValidationError = undefined;
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
            } else if (err instanceof ResourcesExistError) {
                ctx.status = 409;
                ctx.body = { message: err.name, errors: [err.message] };
            } else if (err instanceof ResourcesFailureError) {
                ctx.status = 400;
                ctx.body = { message: err.name, errors: [err.message] };
            } else if (err instanceof NetworkError) {
                ctx.status = 502;
                ctx.body = { message: err.name, errors: [err.message] };
            } else if (err instanceof ValidError) {
                ctx.status = 201;
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
class NetworkError extends Error {
    constructor(message) {
        super();
        this.message = {
            message,
            code: 'network'
        };
        this.name = 'Network Failed';
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.NetworkError = NetworkError;
class ResourcesExistError extends Error {
    constructor(message) {
        super();
        this.message = {
            message,
            code: 'exist'
        };
        this.name = 'Resources Exist';
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.ResourcesExistError = ResourcesExistError;
class ResourcesFailureError extends Error {
    constructor(message) {
        super();
        this.message = {
            message,
            code: 'failure'
        };
        this.name = 'Resources Failure';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ResourcesFailureError = ResourcesFailureError;
class ValidError extends Error {
    constructor(message) {
        super();
        this.message = {
            message: message,
            code: 'validation'
        };
        this.name = 'Error is valid';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ValidError = ValidError;