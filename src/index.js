import onerror from 'koa-onerror'

export default function error (options = {}) {
    let isMountedErrorHandler = false

    return async function _error(ctx, next) {
        if (!isMountedErrorHandler) {
            onerror(ctx.app, options)
            isMountedErrorHandler = true
        }    

        try {
            await next()
        } catch(err) {
            if (err instanceof ValidationError) {
                ctx.status = 422
                ctx.body = { message: err.name, errors: [err.message] }
            } else if (err instanceof ResourcesExistError) {
                ctx.status = 409
                ctx.body = { message: err.name, errors: [err.message] }
            } else if (err instanceof ResourcesFailureError) {
                ctx.status = 400
                ctx.body = { message: err.name, errors: [err.message] }
            } else if (err instanceof NetworkError) {
                ctx.status = 502
                ctx.body = { message: err.name, errors: [err.message] }
            } else if (err instanceof AuthorizeError) {
                ctx.status = 401
                ctx.body = { message: err.name, errors: [err.message] }
            } else {
                throw err
            }
        }
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super()
        this.message = message
        this.name = 'Validation Failed'
        Error.captureStackTrace(this, this.constructor)
    }
}

export class NetworkError extends Error {
    constructor(message) {
        super()
        this.message = {
            message,
            code: 'network'
        }
        this.name = 'Network Failed'
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ResourcesExistError extends Error {
    constructor(message) {
        super()
        this.message = {
            message,
            code: 'exist'
        }
        this.name = 'Resources Exist'
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ResourcesFailureError extends Error {
    constructor(message) {
        super()
        this.message = {
            message,
            code: 'failure'
        }
        this.name = 'Resources Failure'
        Error.captureStackTrace(this, this.constructor)
    }
}

export class AuthorizeError extends Error {
    constructor(message) {
        super()
        this.message = {
            message,
            code: 'auth'
        }
        this.name = 'Authorize Failed'
        Error.captureStackTrace(this, this.constructor)
    }
}