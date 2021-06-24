const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.listenerCount.PORT || 5000
const ObjectId = require('mongodb').ObjectId;

const app = express()

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xpzdq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("Al-Mudaraba").collection("Products");
  const orderCollection = client.db("Al-Mudaraba").collection("Order");

 app.get('/products' , (req , res) => {
   productCollection.find()
   .toArray((err , items)=>{
     res.send(items)
   })

 })
 



 app.post('/addProducts', (req , res) => {
   const newProduct = req.body;
   console.log('adding new product', newProduct)
  productCollection.insertOne(newProduct)
  .then(result=>{
    console.log('inserted count', result.insertedCount)
    res.send(result.insertedCount > 0)
  })
 })

 

 app.get('/products/:id', (req, res) =>{
  const id = req.params.id;
  productCollection.find({_id:ObjectId(id)})
  .toArray((err, documents)=>{
      res.send(documents[0])
  })
})

 app.post('/addOrder', (req , res) =>{
   const newOrder = req.body;
   orderCollection.insertOne(newOrder)
   .then(result => {
    res.send(result.insertedCount > 0);
   })
   console.log(newOrder)
})

app.get('/order' , (req , res) => {
  //console.log(req.query.email);
  orderCollection.find({email :req.query.email})
  .toArray((err , documents)=>{
    res.send(documents)
  })
})


app.delete('/deleteProduct/:id' , (req , res) =>{
   const productId = req.params.id;
   productCollection.deleteOne({_id:ObjectId(productId)})
   .then((err , result)=> {
     console.log(result.deleteCount > 0);
   })
})


///
});




app.listen(process.env.PORT || port)
