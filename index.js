const { MongoClient } = require('mongodb');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const multer = require('multer');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'pug');
app.set('views', 'Public/Views');
app.use(express.static(path.join('Public')));
app.use(express.static('node_modules/bootstrap/dist/css'));
app.use(express.static('node_modules/bootstrap/dist/js'));



const uri = 'mongodb://localhost:27017';
const dbName = 'GameOfThrones_RPG';

global.dbName ="GameOfThrones_RPG";

async function readcontent(collectionName){
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Connection succes');
        const db = client.db(dbName);
        
            const data = await db.collection(collectionName).find({}).toArray();
            return data;
    } catch (err) {
        
    }finally {
        // Close the client connection
        await client.close();
      }
}


app.get('/', async(req,res)=>{
    try {
        const charactersdata=await readcontent('Characters');
        const weaponsdata=await readcontent('Weapons');
        res.render('index',{charactersdata,weaponsdata});
    } catch (err) {
        res.status(500).send('Error fetching data');
        console.error('Error fetching data:', err);
    }
});

app.get('/create',async(req,res)=>{
    try{
        const weapons=await readcontent('Weapons');
        res.render('create',{weapons});
    }
    catch(err){
        console.log(err);
    }
})
app.post('/create-character', async (req, res) => {
    try {
      // Extract form data from request body
      const { name, house, health, armor, weapon_id } = req.body;
      const charactersdata=await readcontent('Characters');
      const charId=charactersdata[charactersdata.length-1].id+1;
      // Create document object
      const characterDoc = {
        id: parseInt(charId),
        name: name,
        house: house,
        health: parseInt(health), // Convert to integer
        armor: parseInt(armor), // Convert to integer
        weapon_id: parseInt(weapon_id) // Convert to integer
      };
  
      // Connect to MongoDB
      const client = new MongoClient(uri);
      await client.connect();
  
      // Create document in MongoDB
      await createDoc(client, dbName, 'Characters', characterDoc);
  
      // Close MongoDB connection
      await client.close();
  
      // Redirect to a success page or back to the previous page
      res.redirect('back');
    } catch (error) {
      console.error('Error creating character:', error);
      res.status(500).send('Internal server error');
    }
  });

  app.post('/create-weapon', async (req, res) => {
    try {
      // Extract form data from request body
      const { name, damage, price } = req.body;
      const weaponsdata=await readcontent('Weapons');
      const wepId=weaponsdata[weaponsdata.length-1].id+1;  
      // Create document object
      const weaponDoc = {
        id:parseInt(wepId),
        name: name,
        damage: parseInt(damage), // Convert to integer
        price: parseInt(price) // Convert to integer
      };
  
      // Connect to MongoDB
      const client = new MongoClient(uri);
      await client.connect();
  
      // Create document in MongoDB
      await createDoc(client, dbName, 'Weapons', weaponDoc);
  
      // Close MongoDB connection
      await client.close();
  
      // Redirect to a success page or back to the previous page
      res.redirect('back');
    } catch (error) {
      console.error('Error creating weapon:', error);
      res.status(500).send('Internal server error');
    }
  });

app.get('/showCharacters',async(req,res)=>{
    const characters = await readcontent('Characters');
    res.render('show',{characters});
})
app.get('/showWeapons',async(req,res)=>{
    const weapons = await readcontent('Weapons');
    res.render('show',{weapons});
})
app.get('/deleteCharacter/:id', async (req, res) => {
    try {
        const characterId = req.params.id;
        const charId = characterId.split(':')[1];
        
        // Connect to the MongoDB client
        const client = new MongoClient(uri);
        await client.connect();

        // Delete the character from the database
        await deleteOne(client, dbName, 'Characters', charId);

        // Close the MongoDB client
        await client.close();

        // Redirect back to the previous page
        res.redirect('back');
    } catch (error) {
        console.error('Error deleting character:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/deleteWeapon/:id', async (req, res) => {
    try {
      // Extract weapon ID from request parameters
      const weaponId = req.params.id;
      const wepID = weaponId.split(':')[1];
  
      // Connect to MongoDB
      const client = new MongoClient(uri);
      await client.connect();
  
      // Delete weapon from MongoDB
      await deleteOne(client, dbName, 'Weapons', wepID);
  
      // Close MongoDB connection
      await client.close();
  
      // Redirect to a success page or back to the previous page
      res.redirect('back');
    } catch (error) {
      console.error('Error deleting weapon:', error);
      res.status(500).send('Internal server error');
    }
  });
  
  app.get('/fight', async (req, res) => {
    try {
      // Fetch characters and weapons data from the database
      const characters =await readcontent('Characters');
      const weapons = await readcontent('Weapons');
  
      // Render the fight page template with characters and weapons data
      res.render('fight', { characters: characters, weapons: weapons });
    } catch (error) {
      console.error('Error rendering fight page:', error);
      res.status(500).send('Internal server error');
    }
  });

app.get('*',(req,res)=>{
    res.send("404 page not found");
})

app.listen(port);

async function deleteOne(client, dbName, collectionName, value) {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({ id: parseInt(value) }); // Assuming 'id' is numeric
    console.log(`${result.deletedCount} document(s) deleted from ${collectionName}`);
}
async function createDoc(client, dbName, collectionName, doc) {
    const dbObject = client.db(dbName);
    const collection = dbObject.collection(collectionName);
    const result = await collection.insertOne(doc);
    console.log(`The new document was created with the following id: ${result.insertedId}`);
  }