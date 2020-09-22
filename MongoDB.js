const MongoClient = require('mongodb').MongoClient;

/**
	Initiates a connection with the database and provides basic query functionality
**/
class MongoDB {
	constructor() {
		
	}
	/**
		Connects to the database
	**/
	async connect() {
		try {
			const client = new MongoClient(process.env.CONNECTION_STRING);
			await client.connect();
			this.db = client.db('sports');
		}
		catch(error) {
			console.log(error, 'MongoDB connection failed');
		}
	}
	/**
		Removes a record from the database
		@param collection name of collection to edit
		@param document document object to remove
	**/
	async remove(collection, query) {
		try {
			let response = await this.db.collection(collection).deleteOne(query);
			console.log(response.matchedCount);
		}
		catch(error) {
			console.log(error, 'Failed to delete record.');
		}
	}
	/**
		Inserts a record into the database
		@param collection name of collection to edit
		@param document document object to remove
	**/
	async insert(collection, document) {
		try {
			await this.db.collection(collection).insertOne(document);
		}
		catch(error) {
			console.log(error, 'Failed to insert record.');
		}
	}
	/**
		Inserts many records into the database
		@param collection name of collection to edit
		@param documents document objects to insert
	**/
	async insertMany(collection, documents) {
		try {
			await this.db.collection(collection).insertMany(documents);
		}
		catch(error) {
			console.log(error, 'Failed to insert multiple records.');
		}
	}
	/**
		Updates a record in the database
		@param collection name of collection to edit
		@param query object containing parameters to match
		@param updateDoc object containing fields and information to edit
	**/
	async update(collection, query, updateDoc) {
		try {
			await this.db.collection(collection).updateOne(query, updateDoc);
		}
		catch(error) {
			console.log(error, 'Failed to update record');
		}
	}
}

module.exports = new MongoDB();