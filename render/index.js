const {
  access_token_key,
  access_token_secret,
  consumer_key,
  consumer_secret
} = require('config')
const $ = require('jquery')
const Twitter = require('twitter')
const demotronCard = require('./demotron-card.js')

const $root = $('#root')
const client = new Twitter({
  access_token_key,
  access_token_secret,
  consumer_key,
  consumer_secret
})

function addErrorMessage (message) {
  $root.html(`<div class="alert alert-danger">${message}</div>`)
}

function addTweet (tweet) {
  $root.html(demotronCard(tweet))
}

client.get(
  'statuses/user_timeline',
  {
    count: 1,
    include_rts: false,
    screen_name: 'realDonaldTrump'
  },
  (error, tweets) => {
    if (error) {
      console.error(error)

      if (error instanceof Error) {
        addErrorMessage(error.message)
      } else if (Array.isArray(error)) {
        addErrorMessage(error[0].message)
      }
    } else if (!tweets.length) {
      addErrorMessage('Couldn\'t fetch latest tweet')
    } else {
      addTweet(tweets[0])
    }
  }
)
