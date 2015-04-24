# URF Madness
Angular/Nodejs entry for the Riot API Challenge.
URF Madness isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.

# Description
URF Madness is a website providing random and accurate facts about the URF games for each league in the game.
Ever wanted to know how many players went jungle in URF? How often Urgot is picked? Then you are at the right place!

# Installation
You first need to install:
* **Nodejs** : https://nodejs.org/download/
* **MongoDB** : https://www.mongodb.org/downloads

You can then type:
```sh
$ npm install -g bower
$ npm update
$ bower install
```

To collect our data, we retrieved all the URF game data sent by the RIOT API, using the api-challenge and match endpoints.
We collected 138898 games covering a 10 days time-lapse, and stored them on our database, using the script in misc/data_fetcher.
We then made an average of all the interesting data (kills, items, champions picks/bans, neutral minions timers...) for each league, using the script in misc/data_formatter.

To avoid the burden of collecting the games for days, we exported our database data in the folder data. You can simply create a local mongoDB database named "urf" and import the data into it.

You should then be able to start the server locally.

# Usage
To start the server, simply type:
```sh
$ node app.js
```
You can then access the website at http://localhost:5142/

# Live demo
You can preview the website live at http://urfmadness.archorn.eu/