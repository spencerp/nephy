'use strict';

// Quickstart example
// See https://wit.ai/l5t/Quickstart

// When not cloning the `node-wit` repo, replace the `require` like so:
const Wit = require('node-wit').Wit;
var accountSid = 'AC43f00c7fc3b6e1c224112a677c02c56a'; 
var authToken = '0098aa109fc864c3aea0a68704c0fb8b';
var twilio = require('twilio');

var twilio_client = twilio(accountSid, authToken), 
cronJob = require('cron').CronJob,
express = require('express'),
bodyParser = require('body-parser'),
app = express();

console.log('WTF');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));


// app.post('/message', function (req, res) {
//   var resp = new twilio.TwimlResponse();
//   resp.message('Thanks for subscribing!');
//   res.writeHead(200, {
//     'Content-Type':'text/xml'
//   });
//   res.end(resp.toString());
// });


var textJob = new cronJob( '8 21 * * *', function(){
  twilio_client.sendMessage( { to: '1-210-219-7018', from: '+18307420376',
      body:'Hello! Hope you’re having a good day!' }, function( err, data ) {});
},  null, true);


const token = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node index.js <wit-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    const food = firstEntityValue(entities, 'food');
    if (food) {
      console.log(food);
      context.food = food;
    }
    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
  ['suggest'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    context.advice = 'don\'t';
    cb(context);
  },
};

const client = new Wit(token, actions);
client.interactive();


// var server = app.listen(3000, function() {
//   console.log('Listening on port %d', server.address().port);
// });

