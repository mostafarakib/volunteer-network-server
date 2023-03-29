const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kix57j0.mongodb.net/?retryWrites=true&w=majority?directConnection=true`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("volunteerNetwork");
    const eventsCollection = database.collection("events");

    // GET API
    app.get("/events", async (req, res) => {
      const cursor = eventsCollection.find({});
      const events = await cursor.toArray();
      res.send(events);
    });

    app.get("/events/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const event = await eventsCollection.findOne(query);
      res.send(event);
    });
    // POST API
    app.post("/events", async (req, res) => {
      const newEvent = req.body;
      const result = await eventsCollection.insertOne(newEvent);
      res.json(result);
    });

    // DELETE API
    app.delete("/events/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await eventsCollection.deleteOne(query);
      res.json(result);
    });

    // PUT API
    app.put("/events/:id", async (req, res) => {
      const id = req.params.id;
      const updatedEvent = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedEvent.name,
          img: updatedEvent.img,
          description: updatedEvent.description,
        },
      };

      const result = await eventsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running volunteer network server");
});
app.get("/s", (req, res) => {
  res.send("something running on server");
});

app.listen(port, () => {
  console.log("running server on port", port);
});
