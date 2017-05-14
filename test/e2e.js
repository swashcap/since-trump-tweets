'use strict'

const { Application } = require('spectron')
const electron = require('electron')
const path = require('path')
const tape = require('tape')

let app

tape('e2e :: setup', (t) => {
  app = new Application({
    args: [path.resolve(__dirname, '..')],
    path: electron
  })
  app.start().then(() => t.end(), t.end)
})

tape('e2e :: shows a window', (t) => {
  t.plan(2)

  app.client.getWindowCount()
    .then((count) => {
      t.equal(count, 1, 'shows a window')

      return app.client.waitForText('#root', 3000)
    })
    .then(() => app.client.getText('#root'))
    .then((text) => {
      // TODO: Improve tweet check
      t.ok(
        text.toLowerCase().includes('since trump'),
        'adds tweet to window'
      )
    })
    .catch(t.end)
})

tape('e2e :: teardown', (t) => {
  if (app && app.isRunning()) {
    app.stop().then(() => t.end(), t.end)
  } else {
    t.end()
  }
})
