const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
let coll;
client.connect().then(() => {
  coll = client.db("smoke").collection("notes");
  console.log("mongo connected");
});

app.get("/api/notes", async (_, res) => res.json(await coll.find().toArray()));
app.post("/api/notes", async (req, res) => {
  const { text } = req.body;
  const { insertedId } = await coll.insertOne({ text, at: new Date() });
  res.json({ _id: insertedId, text });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
