import koa from 'koa'
import test from 'ava'
import error from '../src'
import request from 'request'
import mount from 'koa-mount'
import { ValidationError, ResourcesExistError, ResourcesFailureError } from '../src'

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
    app.use(mount('/resources-exist', async function (ctx, next) {
        throw new ResourcesExistError('test')
    }))
    app.use(mount('/resources-failure', async function (ctx, next) {
        throw new ResourcesFailureError('test')
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

test('ValidationError', (t) => {
    let err = t.throws(() => {
        throw new ValidationError('test')
    })

    t.is(err.message, 'test')
    t.is(err.name, 'Validation Failed')
})

test.cb('ValidationError, in middleware', (t) => {
    req.get('/validation', (err, res, body) => {
        t.is(res.statusCode, 422)
        t.is(body.message, 'Validation Failed')
        t.deepEqual(body.errors, [{ errors: 'test' }])
        t.end()
    })
})

test('ResourcesExistError', (t) => {
    let err = t.throws(() => {
        throw new ResourcesExistError('test')

        t.is(err.message.message, 'test')
        t.is(err.name, 'Resources Exist')
    })
})

test.cb('ResourcesExistError, in middleware', (t) => {
    req.get('/resources-exist', (err, res, body) => {
        t.is(res.statusCode, 409)
        t.is(body.message, 'Resources Exist')
        t.deepEqual(body.errors, [{ message: 'test', code: 'exist' }])
        t.end()
    })
})

test('ResourcesFailureError', (t) => {
    let err = t.throws(() => {
        throw new ResourcesFailureError('test')

        t.is(err.message.message, 'test')
        t.is(err.name, 'Resources Failure')
    })
})

test.cb('ResourcesFailureError, in middleware', (t) => {
    req.get('/resources-failure', (err, res, body) => {
        t.is(res.statusCode, 400)
        t.is(body.message, 'Resources Failure')
        t.deepEqual(body.errors, [{ message: 'test', code: 'failure' }])
        t.end()
    })
})