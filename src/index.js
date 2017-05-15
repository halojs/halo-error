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