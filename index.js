const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shtpn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const serviceCollection = client.db("travelAgency").collection("services");
  const registerCollection = client.db("travelAgency").collection("booking");

  // load the data at a time
  app.get("/services", async (req, res) => {
    const result = await serviceCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });
  // find a single services
  app.get("/services/:id", async (req, res) => {
    const id = req.params.id;
    const result = await serviceCollection.findOne({ _id: ObjectId(id) });
    res.send(result);
  });
  // find a single services
  app.post("/register", async (req, res) => {
    const registerInfo = req.body;
    const result = await registerCollection.insertOne(registerInfo);
    res.send(result);
  });

  // get all bookings
  app.get("/allregister", async (req, res) => {
    const result = await registerCollection.find({}).toArray();
    res.send(result);
  });

  app.delete("/remove/:id", async (req, res) => {
    const id = req.params.id;
    const result = await registerCollection.deleteOne({ _id: ObjectId(id) });
    res.send(result);
    console.log(result);
  });
  //   client.close();
});

app.get("/", (req, res) => {
  res.send("Getting successfully");
});

app.listen(port, () => {
  console.log("listening on port", port);
});
