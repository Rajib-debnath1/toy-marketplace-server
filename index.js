const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const colors = require("colors")

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.saahjrs.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


        async function server() {
            const toyCollections = client.db("assignment11").collection("toys");

            app.get('/alltoy',async(req,res)=>{
                const data = await toyCollections.find({}).limit(20).toArray()
               if(data){
                res.send(data)
               }
               else{
                res.send("There is no data")
               }
            })

            



        }
        server().catch(console.dir)


app.get('/', (req, res) => {
    res.send(' Funny Toys is running')
})

app.listen(port, () => {
    console.log(`Funny ToysServer is running on port ${port}`.red.underline.bold)
})