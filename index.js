const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.igjj82v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const alltoyCollection = client.db("EducationalToyDB").collection("AllToy");
  


    app.post('/AllToy', async (req, res) => {
        const item = req.body;
        const result = await alltoyCollection.insertOne(item);
        res.send(result);
      })

      app.get('/AllToy',async(req,res)=>{

        //   console.log(req.query.email)
        const sort = req.query.sort;
        const search = req.query.search;

          console.log(search)
          let query={};

           const filter = {toyName:{$regex: search, $options:'i'}};
          const options = {
             sort:{'price': sort == 'asc'? 1 : -1}
          }
          if(req.query?.email){
             query = {
                sellerEmail:req.query.email}
          }
         const result = await alltoyCollection.find(query,options).toArray();
         res.send(result); 
      })

      app.delete('/AllToy/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        const result = await alltoyCollection.deleteOne(query);
        res.send(result);
      })

      app.get('/AllToy/:id',async(req,res)=>{
         const id = req.params.id;
         const query = { _id: new ObjectId(id)};
        const result = await alltoyCollection.findOne(query);
        res.send(result);

      })
      app.patch('/AllToy/:id',async(req,res)=>{
        const id = req.params.id;
        const filter = {_id:new ObjectId(id)};
        const updateStatus = req.body;
        console.log(updateStatus);
        const updateDoc = {
          $set: {
            price: updateStatus.price,
            quantity: updateStatus.quantity,
            description: updateStatus.description,
           
          },
        };
        const result = await alltoyCollection.updateOne(filter,updateDoc);
        res.send(result);
      })

    
  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Assignment-11 coming..');
  })
  
  app.listen(port, () => {
    console.log(`Assignment-11 is sitting on port ${port}`);
  })