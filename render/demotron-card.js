'use strict';

const moment = require('moment');

const demotronCard = ({
  created_at,
  entities: {
    urls: [{
      expanded_url,
    }],
  },
  favorite_count,
  retweet_count,
  text,
}) => {
  const createdAt = moment(created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY');
  const daysSince = createdAt.diff(moment(), 'days');
  let className = 'card'; 

  if (daysSince < 1) {
    className += ' card-error';
  } else if (daysSince < 2) {
    className += ' card-warning';
  } else if (daysSince < 3) {
    className += ' card-notice';
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
      <a href="${expanded_url}" rel="bookmark" title="View on Twitter">
        <p>${text}</p>
        <ul>
          <li>Retweets: ${retweet_count}</li>
          <li>Likes: ${favorite_count}</li>
        </ul>
      </a>
    </article>
  </div>`;
};

module.exports = demotronCard;

