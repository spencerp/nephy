// Twilio Credentials 
var accountSid = 'AC43f00c7fc3b6e1c224112a677c02c56a'; 
var authToken = '0098aa109fc864c3aea0a68704c0fb8b'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
client.messages.create({ 
	to: "1-210-219-7018", 
	from: "+18307420376", 
	body: "YO THIS IS NEPHY BITCH. WATCH YO SELF",   
}, function(err, message) { 
	console.log(message.sid); 
});
