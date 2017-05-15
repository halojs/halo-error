import koa from 'koa'
import test from 'ava'
import error from '../src'
import request from 'request'
import mount from 'koa-mount'
import { ValidationError } from '../src'

const req = request.defaults({
    json: true,
    baseUrl: 'http://localhost:3000'
})

test.before.cb((t) => {
    let app = new koa()
    
    app.use(error())
    app.use(mount('/tests', async function (ctx, next) {
        tests()
    }))
    app.use(mount('/validation', async function (ctx, next) {
        throw new ValidationError({
            errors: 'test'
        })
    }))
    app.listen(3000, t.end)
})

test.cb('koa-onerror', (t) => {
    req.get('/tests', (err, res, body) => {
        t.is(res.statusCode, 500)
        t.deepEqual(body, { error: 'tests is not defined' })
        t.end()
    })
})

test.cb('test validation error class', (t) => {
    let err = t.throws(() => {
        throw new ValidationError('test')
    })

    t.is(err.message, 'test')
    t.is(err.name, 'Validation Failed')
    t.end()
})

test.cb('test validation error class, in middleware', (t) => {
    req.get('/validation', (err, res, body) => {
        t.is(res.statusCode, 422)
        t.is(body.message, 'Validation Failed')
        t.deepEqual(body.errors, [{ errors: 'test' }])
        t.end()
    })
})