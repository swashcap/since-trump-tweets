'use strict'

/**
 * Get props for the card component
 *
 * @param {Moment} createdAt
 * @returns {Object}
 */
module.exports.getProps = function getProps (createdAt) {
  return {
    created_at: createdAt.format('ddd MMM DD HH:mm:ss ZZ YYYY'),
    entities: {
      urls: [{
        expanded_url: 'https://test.net'
      }]
    },
    favorite_count: 1337,
    retweet_count: 80085,
    text: 'Lorem ipsum dolor sit amet...'
  }
}
