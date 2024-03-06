const { MongoClient } = require('mongodb');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const body_parser = require('body-parser');
const multer = require('multer');

app.use(body_parser.urlencoded({extended: true}));

app.set('view engine', 'pug');
app.set('views', 'Public/Views');
app.use(express.static(path.join('Public')));
app.use(express.static('node_modules/bootstrap/dist/css'));
app.use(express.static('node_modules/bootstrap/dist/js'));

const uri = 'mongodb://localhost:27017';
const dbName = 'GameOfThrones-RPG';

async function readcontent(collectionName){
    const client = new MongoClient(uri);
    try {
        await client.connect();
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
app.get('/create-characters',(req,res)=>{
    res.render('js/createcharacter')
})

app.get('*',(req,res)=>{
    res.send("404 page not found");
})

app.listen(port);
