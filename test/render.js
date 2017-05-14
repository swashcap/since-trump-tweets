'use strict'

const { JSDOM } = require('jsdom')
const moment = require('moment')
const sinon = require('sinon')
const tape = require('tape')
const Twitter = require('twitter')

const demotronCard = require('../render/demotron-card.js')
const { getProps } = require('./helpers.js')

let jQuery
let render

tape('render :: setup', (t) => {
  const dom = new JSDOM('<!doctype html><div id="root"></div>')

  global.window = dom.window

  jQuery = require('jquery')
  render = require('../render/index.js')
  t.end()
})

tape('render :: adds error message', (t) => {
  const message = 'Test errorz wat'

  render.addErrorMessage(message)

  t.ok(
    jQuery('#root').text().includes(message),
    'adds error message to DOM'
  )

  jQuery('#root').html('') // cleanup
  t.end()
})

tape('render :: adds tweet', (t) => {
  const props = getProps(moment().subtract(1, 'day'))
  render.addTweet(props)

  t.equal(
    jQuery('#root').html(),
    demotronCard(props),
    'adds card component'
  )

  jQuery('#root').html('') // cleanup
  t.end()
})

tape('render :: fetches tweet', (t) => {
  const props = {}
  const getStub = sinon.stub(Twitter.prototype, 'get')
    .yields(null, [props])
  const error1 = new Error('wat')
  const error2 = new Error('waaat')

  getStub.onCall(0).yields(error1)
  getStub.onCall(1).yields(error2)

  t.plan(3)

  render.fetchTweet()
    .then(t.fail, (error) => {
      t.equal(error, error1, 'rejects with error')
      return render.fetchTweet()
    })
    .then(t.fail, (error) => {
      t.equal(error, error2, 'rejects with array\'d error')
      return render.fetchTweet()
    })
    .then((tweet) => {
      t.equal(tweet, props, 'resolves with tweet')
    })
    .catch(t.end)
})

tape('render :: teardown', (t) => {
  delete global.window
  t.end()
})
