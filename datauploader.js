const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const dbName = 'GameOfThrones_RPG'; // Change this to your database name

const characters = [
    { id: 1, name: 'Tyrion Lannister', house: 'Lannister' ,health:50,armor:10},
    { id: 2, name: 'Jon Snow', house: 'Stark',health:100 ,armor:15},
    { id: 3, name: 'Daenerys Targaryen', house: 'Targaryen',health:80,armor:5},
    { id: 4, name: 'Bran Stark', house: 'Stark',health:30,armor:5},
    { id: 5, name: 'Samwell Tarly', house: 'Tarly',health:120,armor:10}
  ];
  const weapons = [
    { id: 0, name: 'Fist', damage:3 ,price:0},
    { id: 1, name: 'Sword', damage:20 ,price:100},
    { id: 2, name: 'Long Sword', damage:20 ,price:100},
    { id: 3, name: 'Dagger', damage:20 ,price:100},
    { id: 4, name: 'Bow', damage:20 ,price:100},
    { id: 5, name: 'Lance', damage:20 ,price:100},
  ];

  async function insertData() {
    const client = new MongoClient(uri);
  
    try {
      // Connect to the MongoDB client
      await client.connect();
  
      // Get the database
      const db = client.db(dbName);
  
      // Insert the data into the collection
      const result = await db.collection('Characters').insertMany(characters);
      const result2 = await db.collection('Weapons').insertMany(weapons);
      console.log(`${result.insertedCount} documents inserted`);
      console.log(`${result2.insertedCount} documents inserted`);
    } catch (err) {
      console.error('Error inserting data:', err);
    } finally {
      // Close the client connection
      await client.close();
    }
  }
  
  // Call the insertData function
  insertData();