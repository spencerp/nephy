'use strict';

// Quickstart example
// See https://wit.ai/l5t/Quickstart

// When not cloning the `node-wit` repo, replace the `require` like so:
const Wit = require('node-wit').Wit;
const http = require('http');


const getNutrientFacts = ((id, context, callback) => {
  http.get(
    "http://api.nal.usda.gov/ndb/reports/?ndbno=" + id + "&type=f&format=json&api_key=hhrhGfhytRdiE3nDCPKuKU1xx1t3u1eGGFcz2igy",
    function(response) {
      // Continuously update stream with data
      var body = '';
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', function() {
        // Data reception is done, do whatever with it!
        var parsed = JSON.parse(body);
        var sensitives = {};
        const report = parsed.report;
        const nutrients = report.food.nutrients;
        for (var i = 0; i < nutrients.length; i++) {
          const mineral = nutrients[i].name;
          const quant = nutrients[i].value;
          switch (mineral) {
            case "Sodium, Na":
              sensitives.sodium = quant;
              break;
            case "Phosphorus, P":
              sensitives.phosphorus = quant;
              break;
            case "Potassium, K":
              sensitives.potassium = quant;
              break;
          }
        }
        context.advice = "Sodium: " + sensitives.sodium +
          ", Phosphorus: " + sensitives.phosphorus +
          ", Potassium: " + sensitives.potassium;
        callback(context);
      });
  });
});

const getMineralContentForFood = ((context, callback) => {
  console.log("food id started");
    const food = context.food;
    const url = 'http://api.nal.usda.gov/ndb/search/?format=json&q=' + food + '&sort=n&max=25&offset=0&api_key=hhrhGfhytRdiE3nDCPKuKU1xx1t3u1eGGFcz2igy';
    console.log(url);
    http.get(url, 
	function(response) {
      console.log("response");
      // Continuously update stream with data
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        // Data reception is done, do whatever with it!
        const parsed = JSON.parse(body);
	var id;
	if (parsed.list) {
	  const items = parsed.list.item;
	  if (items[0]) {
	    id = items[0].ndbno;
	  }
	}
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
      context.food = food;
    }
    cb(context);
  },
  error(sessionId, context, error) {
    console.log(error.message);
  },
  ['suggest'](sessionId, context, cb) {
    getMineralContentForFood(context, cb); 
  },
};

const client = new Wit(token, actions);
client.interactive();
