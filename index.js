'use strict';

// Quickstart example
// See https://wit.ai/l5t/Quickstart

// When not cloning the `node-wit` repo, replace the `require` like so:
const Wit = require('node-wit').Wit;

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
