const {
  access_token_key,
  access_token_secret,
  consumer_key,
  consumer_secret
} = require('../config/twitter.json')
const $ = require('jquery')
const Twitter = require('twitter')
const card = require('./card.js')
const { shell } = require('electron')

const $root = $('#root')
const client = new Twitter({
  access_token_key,
  access_token_secret,
  consumer_key,
  consumer_secret
})

/**
 * Open all links in default browser
 * {@link https://electron.atom.io/docs/api/shell/#shellopenexternalurl-options-callback}
 */
$root.click((event) => {
  const $anchor = $(event.target).parent('a')

  if ($anchor.length) {
    event.preventDefault()
    shell.openExternal($anchor.attr('href'))
  }
})

const addErrorMessage = message => $root.html(
  `<div class="alert alert-danger">${message}</div>`
)

const addTweet = tweet => $root.html(card(tweet))

const fetchTweet = () => new Promise((resolve, reject) => {
  client.get(
    'statuses/user_timeline',
    {
      count: 1,
      include_rts: false,
      screen_name: 'realDonaldTrump'
    },
    (error, tweets) => {
      if (error) {
        if (error instanceof Error) {
          reject(error)
        } else if (Array.isArray(error)) {
          reject(error[0])
        }
      } else if (!tweets.length) {
        reject(new Error('Couldn\'t fetch latest tweet'))
      } else {
        resolve(tweets[0])
      }
    }
  )
})

const init = () => {
  fetchTweet()
    .then(addTweet)
    .catch((error) => {
      console.error(error)
      addErrorMessage(error.message)
    })
}

// Boot if this is the main entry point
if (require.main === module) {
  init()
}

module.exports = {
  addErrorMessage,
  addTweet,
  fetchTweet,
  init
}
