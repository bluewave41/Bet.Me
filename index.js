require('dotenv').config();
const MongoDB = require('./MongoDB');
const APIController = require('./APIController');

const HOUR = 3600*1000; //hour in seconds

let current;

MongoDB.connect().then(function() {
	start();
})

async function start() {
	//Insert the in season sports
	let inSeasonSports = await APIController.getInSeasonSports();
	MongoDB.insertMany('sports', inSeasonSports);
	
	//insert upcoming games for each sport key
	let keys = inSeasonSports.map(el => el.key); //filter out only the keys
	for(var i=0;i<keys.length;i++) {
		let upcomingGames = await APIController.getUpcoming(keys[i], 'uk', 'h2h');
		MongoDB.insertMany('upcoming', upcomingGames);
	}
}

/*Theoretically call this every second to make it real time?*/
async function getInPlayOdds() {
	current = await APIController.getOddsForInPlayMatch('upcoming', 'uk', 'h2h', 5000);
	
	//remove in play games from upcoming in database since they aren't upcoming anymore
	for(var i=0;i<current.length;i++) {
		let game = current[i];
		const query = {home_team: game.home_team}
		MongoDB.remove('upcoming', query);
	}
}

/*Updating upcoming table every hour*/
setInterval(async function() {
	let activeSports = await APIController.getInSeasonSports();
	let keys = activeSports.map(el => el.key);
	
	for(var i=0;i<keys.length;i++) {
		let sportKey = keys[i];
		let upcomingGames = await APIController.getUpcoming(sportKey, 'uk', 'h2h');
		
		//Update the sites parameter for each upcoming game
		for(var j=0;j<upcomingGames.length;j++) {
			let game = upcomingGames[j];
			const query = {home_team: game.home_team};
			const updateDoc = {
				$set: {
					sites: game.sites
				},
			};
			MongoDB.update('upcoming', query, updateDoc);
		}
	}
}, HOUR);