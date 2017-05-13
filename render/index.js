const {
  access_token_key,
  access_token_secret,
  consumer_key,
  consumer_secret,
} = require('config');
const $ = require('jquery');
const moment = require('moment');
const Twitter = require('twitter');

const $root = $('#root');
const client = new Twitter({
  access_token_key,
  access_token_secret,
  consumer_key,
  // consumer_secret,
});

function addErrorMessage(message) {
  $root.html(`<div class="alert alert-danger">${message}</div>`);
}

function addTweet(tweet) {
  $root.html(`
    <div className="${tweet.className}">
      <h1>
        <strong>${tweet.daysSince}</strong>
        ${tweet.daysSince === 1 ? 'day' : 'days'}
        since last tweet
      </h1>
      <article class="tweet">
        <div class="tweet-text">
          ${tweet.text}
        </div>
        <footer class="tweet-meta">
          <div class="tweet-favorites">
            ${tweet.favorites}
          </div>
          <div class="tweet-retweets">
            ${tweet.retweets}
          </div>
        </footer>
      </article>
    </div>
  `);
}

client.get(
  'statuses/user_timeline',
  {
    count: 1,
    include_rts: false,
    screen_name: 'realDonaldTrump',
  },
  (error, tweets) => {
    if (error) {
      console.error(error);

      if (error instanceof Error) {
        addErrorMessage(error.message);
      } else if (Array.isArray(error)) {
        addErrorMessage(error[0].message);
      }
    } else if (!tweets.length) {
      addErrorMessage('Couldn\'t fetch latest tweet');
    } else {
      const daysSince = moment(tweets[0].created_at).diff(moment(), 'days');
      let className;

      if (daysSince < 1) {
        className = 'error';
      } else if (daysSince < 2) {
        className = 'warning';
      } else {
        className = 'still-not-great';
      }

      addTweet({
        className,
        daysSince,
        favorites: tweets[0].favorite_count,
        retweets: tweets[0].retweet_count,
        text: tweets[0].text,
      });
    }
  }
);

