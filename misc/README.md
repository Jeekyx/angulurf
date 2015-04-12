# Backend utilities
### Data fetcher
Command line program that fetches data from the RIOT API and store them in the databse.
```sh
$ npm install
$ node app.js module
```
####modules
* **static** : fetches all the static data
* **crawler** : starts requesting URF games data

### Data formatter
Command line program that reads all the games data from the database and creates a formatted result with an average of all the useful data.
```sh
$ npm install
$ node app.js
```