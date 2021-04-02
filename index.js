const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const app = express()


app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 5050;

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.omrot.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bicycleCollection = client.db("bicycle").collection("products");
  const newBicycleCollection = client.db("bicycle").collection("newBicycle");

  app.get('/products', (req, res) => {
      bicycleCollection.find()
      .toArray((err, items) => {
          res.send(items)
          console.log('itemssss', items)
      })
  })

  //for specific item 
  // app.get('/singleItem', (req, res) => {
    
  //   bicycleCollection.find({})
  //   .toArray((err, items) => {
  //     res.send(items)
  //   })
  // })


  //add orders
  app.post('/addOrders', (req, res) => {
    const newOrders = req.body;
    newBicycleCollection.insertOne(newOrders)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
    console.log(newOrders);
  })

  //add order read in client side
  app.get('/orderRead', (req, res) => {
    newBicycleCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })


  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      console.log('elee', newProduct)

      bicycleCollection.insertOne(newProduct)
      .then(result => {
          console.log('server response', result)
          res.send(result.insertedCount > 0)
      })
  })
});


app.listen(port, () => {
  // console.log(`Example app listening at http://localhost:${port}`)
})