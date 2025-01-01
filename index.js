const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.69y2p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB!");

    const productCollection = client.db('emaJohnDB').collection('products');

    app.get('/products', async (req, re) => {

      try {
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size);

        console.log(page,size)

        const result = await productCollection.find().skip(page * size).limit(size).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
      }
    });


    app.post('/productById', async (req, res) => {

      try {
  
          const ids = req.body; // Expecting an array of IDs
  
          console.log(ids);
  
  
          // Convert string IDs to ObjectId
  
          const idsWithObjectId = ids.map(id => new ObjectId(id));
  
  
          // Create a query to find products with the given IDs
  
          const query = {
  
              _id: {
  
                  $in: idsWithObjectId
  
              }
  
          };
  
  
          // Fetch the products from the database
  
          const result = await productCollection.find(query).toArray();
  
  
          // Send the result back to the client
  
          res.send(result);
  
      } catch (error) {
  
          console.error('Error fetching products:', error);
  
          res.status(500).send({ error: 'An error occurred while fetching products.' });
  
      }
  
  });





    app.get('/productsCount', async (req, res) => {
      try {
        const result = await productCollection.estimatedDocumentCount();
        res.send({result});
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('john is busy shopping');
});

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
});