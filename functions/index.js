const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({ origin: true });
const Twit = require('twit');

var T = new Twit({
  consumer_key: 'REPLACE ME',
  consumer_secret: 'REPLACE ME',
  app_only_auth: true,
});
const app = express();
app.use(cors);
app.get('/tweet', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  T.get('search/tweets', { q: '#testinghackathon', count: 1 })
  .then(result => {
    if (result.data.statuses.length === 0) {
      res.status(404).send('Not Found');
      return;
    }
    var tweet = result.data.statuses[0];
    var user = tweet.user;
    res.send({
      id: tweet.id,
      thumb: user.profile_image_url,
      name: user.screen_name,
      text: tweet.text,
    });
  })
  .catch(() => {
    res.status(500).send('Internal Server Error');
  });
});
exports.app = functions.https.onRequest(app);
