'use strict'

const moment = require('moment')

const card = ({
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
  const createdAtDate = moment(createdAt, 'ddd MMM DD HH:mm:ss ZZ YYYY')
  const now = moment()
  const daysSince = now.diff(createdAtDate, 'days')
  let className = ''
  let offsetLabel
  let offsetNumber

  if (daysSince < 1) {
    className = 'card-error'

    const hoursSince = now.diff(createdAtDate, 'hours')

    if (hoursSince >= 1) {
      offsetNumber = hoursSince
      offsetLabel = hoursSince === 1 ? 'hour' : 'hours'
    } else {
      offsetNumber = now.diff(createdAtDate, 'minutes')
      offsetLabel = offsetNumber === 1 ? 'minute' : 'minutes'
    }
  } else {
    offsetNumber = daysSince
    offsetLabel = daysSince === 1 ? 'day' : 'days'

    if (daysSince < 2) {
      className = 'card-warning'
    } else if (daysSince < 3) {
      className = 'card-notice'
    }
  }

  return `<div class="card ${className}">
    <header class="header">
      <h1>
        It’s been
        <em><strong>${offsetNumber}</strong> ${offsetLabel}</em>
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

module.exports = card
