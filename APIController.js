require('dotenv');
const axios = require('axios');

/*Add API key into requests wiht interceptor*/
axios.interceptors.request.use(function (config) {
	config.url += process.env.API_KEY;
	console.log(config.url);
    return config;
}, function (error) {
    return Promise.reject(error);
});

module.exports = {
	/**
		Gathers a list of sports that are in season
		Does not contribute to quote usage as per API documentation
	**/
	async getInSeasonSports() {
		let response = await axios.get(process.env.API_LINK + 'sports?apiKey=');
		if(!response || !response.data.success) {
			console.log('Failed to get in season sports');
		}
		else {
			return response.data.data; //axios.data.sportsData
		}
	},
	/**
		Gathers a list of upcoming games
		@param sportKey sportKey as received from sports endpoint
		@param region au (Australia), uk (United Kingdom), eu (Europe), us (United States)
		@param mkt market, currently only h2h
	**/
	async getUpcoming(sportKey, region, mkt) {
		let response = await axios.get(process.env.API_LINK + `odds/?sport=${sportKey}&region=${region}&mkt=${mkt}&apiKey=`);
		return response.data.data; //axios.data.sportsData
	},
	/**
		Gets odds for games currently in play
		@param sportKey always set to upcoming
		@param region au (Australia), uk (United Kingdom), eu (Europe), us (United States)
		@param mkt market, currently only h2h
		@delay number of milliseconds to delay the request by
	**/
	async getOddsForInPlayMatch(sportKey, region, mkt, delay=0) {
		await this.wait(delay);
		let response = await axios.get(process.env.API_LINK + `odds/?sport=${sportKey}&region=${region}&mkt=${mkt}&apiKey=`);
		return response.data.data; //axios.data.sportsData
	},
	/**
		Delays a process by the number of milliseconds given
		@param ms number of milliseconds to delay by
	**/
	wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}