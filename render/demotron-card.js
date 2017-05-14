'use strict'

const moment = require('moment')

const demotronCard = ({
  created_at: createdAt,
  entities: {
    urls: [{
      expanded_url: expandedUrl
    }]
  },
  favorite_count: favoriteCount,
  retweet_count: retweetCount,
  text
}) => {
  const date = moment(createdAt, 'ddd MMM DD HH:mm:ss ZZ YYYY')
  const daysSince = date.diff(moment(), 'days')
  let className = 'card'

  if (daysSince < 1) {
    className += ' card-error'
  } else if (daysSince < 2) {
    className += ' card-warning'
  } else if (daysSince < 3) {
    className += ' card-notice'
  }

  return `<div class=${className}>
    <header class="header">
      <h1>
        It’s been
        <em><strong>0</strong> days</em>
        since Trump
        <span>tweeted</span>
      </h1>
    </header>
    <article class="tweet">
      <a href="${expandedUrl}" rel="bookmark" title="View on Twitter">
        <p>${text}</p>
        <ul>
          <li>Retweets: ${retweetCount}</li>
          <li>Likes: ${favoriteCount}</li>
        </ul>
      </a>
    </article>
  </div>`
}

module.exports = demotronCard
