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

            app.post("/addToy",async(req,res)=>{
                console.log(req.body);
                const data = req.body;
                console.log(data);
                const result = await toyCollections.insertOne(data)
                res.send(result)
            })


            app.get("/toy/:category",async(req,res)=>{
                const {category} = req.params;
                console.log(category,"category");
                const getCategory = await toyCollections.find({category:category}).limit(20).toArray()
                res.send(getCategory)

            })


            app.get("/myToy/:email",async(req,res)=>{
                const {email} = req.params;
                console.log(email,"category");
                const query = {seller:email}
                console.log(query);
                const getoyIdData = await toyCollections.find(query).toArray()
                res.send(getoyIdData)

            })

            app.delete("/deleteToy",async(req,res)=>{
                const id = req.body._id;
                console.log(id);
                const deleteToy = await toyCollections.deleteOne({_id : new ObjectId(id)})
                res.send(deleteToy)
            })

            app.put('/updateToy',async(req,res)=>{
                const data = req.body;
                const {_id,priceU,ratingU,quantityU,detailsU} = data
                const filter = {_id:new ObjectId(_id)}
                const options = { upsert: true };
                // console.log(data);
                const updateDoc ={
                    $set:{
                        price:priceU,
                        rating:ratingU,
                        quantity:quantityU,
                        details:detailsU
                    }
                }
                
                console.log(updateDoc);
                
                const resultToy = await toyCollections.updateOne(filter,updateDoc,options)
                res.send(resultToy)

            })



        }
        server().catch(console.dir)


app.get('/', (req, res) => {
    res.send(' Funny Toys is running')
})

app.listen(port, () => {
    console.log(`Funny ToysServer is running on port ${port}`.red.underline.bold)
})