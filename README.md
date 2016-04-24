# nephy
Project for Bayes Hack 2016

```
npm install
node index.js ZMAUZDY5LSFDLMBHTHKNYZGNOZYMXJXB
For hosting:
	first, use ./ngrok http 4567
	second, go to Twilio phone to Messaging -> Request URL -> http://5550b16a.ngrok.io/message & HTTP Post
```
Explanation: 

Node Javascript is used to communicate with facebook's WIT.ai bot platform
to converse with Chronic Kidney Disease (CKD) patients or their caregivers in natural language. Users 

The user can text 1(830)742-0376 asking whethe they can eat a given food.
The service will text back with a suggestion based on data from the United States Department of Agriculture.
----------
Por ejemplo:

User: Can i eat a bacon sandwich?

Nephy: Be careful, bacon sandwich appears to be pretty high in Sodium.
Potassium: 17%DV/100g
Phosphorus: 28%DV/100g
Sodium: 30%DV/100g
----------

This means that if you were to eat a 100g bacon sandwich, you would reach 17% of your daily value in potassium.
28% of your daily value in phosphorus.
30% of your daily value in sodium.

These 3 minerals were chosen because they are known to cause issues in CKD patients and are not often listed on general nutrition labels. 

More background and information in `Nephy.pdf`.







