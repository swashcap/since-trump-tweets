'use strict'

const cheerio = require('cheerio')
const moment = require('moment')
const tape = require('tape')

const demotronCard = require('../render/demotron-card.js')

const getProps = (createdAt) => ({
  created_at: createdAt.format('ddd MMM DD HH:mm:ss ZZ YYYY'),
  entities: {
    urls: [{
      expanded_url: 'https://test.net',
    }]
  },
  favorite_count: 1337,
  retweet_count: 80085,
  text: 'Lorem ipsum dolor sit amet...'
})

tape('sets date string', (t) => {
  const getDateText = createdAt =>
    cheerio.load(demotronCard(getProps(createdAt)))('h1 em').text()

  t.equal(
    getDateText(moment().subtract(1, 'minute')),
    '1 minute',
    'sets singular minute'
  )
  t.equal(
    getDateText(moment().subtract(29, 'minutes')),
    '29 minutes',
    'sets multiple minutes'
  )
  t.equal(
    getDateText(moment().subtract(1, 'hour')),
    '1 hour',
    'sets singular hour'
  )
  t.equal(
    getDateText(moment().subtract(21, 'hours')),
    '21 hours',
    'sets multiple hours'
  )
  t.equal(
    getDateText(moment().subtract(1, 'day')),
    '1 day',
    'sets singular day'
  )
  t.equal(
    getDateText(moment().subtract(5, 'days')),
    '5 days',
    'sets multiple day'
  )

  t.end()
})

tape('passes props to component', (t) => {
  const props = getProps(moment().subtract(1, 'day'))
  const html = demotronCard(props)
  const $ = cheerio.load(html)

  t.equal(
    $('a').attr('href'),
    props.entities.urls[0].expanded_url,
    'adds tweet link'
  )
  t.ok(
    html.includes(`Likes: ${props.favorite_count}`),
    'adds favorites count'
  )
  t.ok(
    html.includes(`Retweets: ${props.retweet_count}`),
    'adds favorites count'
  )
  t.ok(html.includes(props.text), 'adds text')

  t.end()
})

tape('sets modifier class names', (t) => {
  const getCardEl = offset =>
    cheerio.load(demotronCard(getProps(offset)))('.card')

  const $error = getCardEl(moment().subtract(36, 'minutes'))
  const $warning = getCardEl(moment().subtract(1, 'day'))
  const $notice = getCardEl(moment().subtract(2, 'days'))
  const $card = getCardEl(moment().subtract(6, 'days'))

  t.ok($error.hasClass('card-error'), 'sets error class for < 1')
  t.ok($warning.hasClass('card-warning'), 'sets warning class for < 2')
  t.ok($notice.hasClass('card-notice'), 'sets notice class for < 3')
  t.equal(
    $card.attr('class').trim(),
    'card',
    'sets no modifier class name for > 3 days'
  )

  t.end()
})

