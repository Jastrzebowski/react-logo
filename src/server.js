/* global process, __dirname*/

// import path from 'path'

import React from 'react'
import ReactDOMServer from 'react-dom/server'

import koa from 'koa'
import logger from 'koa-logger'
import route from 'koa-route'

// import assets from '../_cache/assets.json'

const app = koa()
const port = process.env.PORT || 1138

// x-response-time middleware

app.use(function *(next) {
  var start = new Date
  yield next
  var ms = new Date - start
  this.set('X-Response-Time', ms + 'ms')
})

// logger middleware

app.use(logger())

// route middleware

app.use(route.get('/logo', logoAction))
app.use(route.get('/assets', assetAction))

// route definitions

/**
 * Rendering component
 */

function *logoAction() {

  // const Logo = require(path.join(__dirname, 'components', 'logo'))

  // this.body = 'asda'
  this.body = ReactDOMServer.renderToString(<div>Hello World</div>)
}

/**
 * Assets (js)
 */

function *assetAction() {
  this.body = 'assets'
}

app.listen(port, function() {
    console.log('Components loader is running on port', port)
})
