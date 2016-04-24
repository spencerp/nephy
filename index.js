'use strict';

// Quickstart example
// See https://wit.ai/l5t/Quickstart

// When not cloning the `node-wit` repo, replace the `require` like so:
const Wit = require('node-wit').Wit;
const http = require('http');


const getNutrientFacts = ((id, context, callback) => {

  http.get("http://api.nal.usda.gov/ndb/reports/?ndbno=18003&type=f&format=json&api_key=hhrhGfhytRdiE3nDCPKuKU1xx1t3u1eGGFcz2igy"
  //   {
  //     host: 'api.nal.usda.gov',
  //     path: '/ndb/reports/?ndbno=' + id + '&type=f&format=json&api_key=hhrhGfhytRdiE3nDCPKuKU1xx1t3u1eGGFcz2igy'
  // }
  , function(response) {
      // Continuously update stream with data
      var body = '';
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', function() {
        // Data reception is done, do whatever with it!
        var parsed = JSON.parse(body);
        console.log(parsed);
        console.log(parsed.report.food.nutrients);
        var sensitives = {};
        for (var k in parsed.report.food.nutrients) {
          switch (k.name) {
            case "Sodium, Na":
              sensitives.sodium = k.value;
              break;
            case "Phosphorus, P":
              sensitives.phosphorus = k.value;
              break;
            case "Potassium, K":
              sensitives.potassium = k.value;
              break;
          }
        }
        context.advice = "Sodium: " + sensitives.sodium +
          ", Phosphorous: " + sensitives.phosphorous +
          ", Potassium: " + sensitives.potassium;
        console.log("--------" + context.advice);
        callback(context);
        // callback({
        //     sodium: sensitives.sodium,
        //     phosphorous: sensitives.phosphorus,
        //     potassium: sensitives.potassium,
        // });
      });
  });
});

const getFoodId = ((context, callback) => {
  console.log("food id started");
    var food = callback.food;
    http.get({
        host: 'api.nal.usda.gov',
        path: '/ndb/search/?format=json&q=' + food
        + '&sort=n&max=25&offset=0&api_key=hhrhGfhytRdiE3nDCPKuKU1xx1t3u1eGGFcz2igy'
    }, function(response) {
      console.log("response");
      // Continuously update stream with data
      var body = '';
      response.on('data', function(d) {
        // console.log(d);
        body += d;
      });
      response.on('end', function() {
        // Data reception is done, do whatever with it!
        var parsed = JSON.parse(body);
        console.log(parsed.errors.error[0]);
          // var sensitives = {};
          // for (var k in parsed.nutrients) {
          //   switch (k.name) {
          //     case "Sodium, Na":
          //       sensitives.sodium = k.value;
          //       break;
          //     case "Phosphorus, P":
          //       sensitives.phosphorus = k.value;
          //       break;
          //     case "Potassium, K":
          //       sensitives.potassium = k.value;
          //   }
          // }

          // callback({
          //     sodium: sensitives.sodium,
          //     phosphorous: sensitives.phosphorus,
          //     potassium: sensitives.potassium,
          // });
          const id = "1";
          getNutrientFacts(id, context, callback);
      });
    });
});







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
    if (!context.food) {
      context.food = "bananas";
    }
    console.log(context);
    getFoodId(context, cb);
    // cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
  ['suggest'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    getNutrientFacts(context, cb);

    context.advice = 'don\'t';
    cb(context);
  },
};

const client = new Wit(token, actions);
client.interactive();
