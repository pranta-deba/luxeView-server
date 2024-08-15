const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kdhebsc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const db = client.db("luxe-view");
    const productCollection = db.collection("products");
    const userCollection = db.collection("users");

    // register
    app.post("/register", async (req, res) => {
      const { name, email } = req.body;
      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        return res.send({ acknowledged: false, insertedId: null });
      }
      const result = await userCollection.insertOne({
        name,
        email,
        createAt: new Date(),
      });
      res.send(result);
    });

    // login
    app.post("/login", async (req, res) => {
      const { email } = req.body;
      const user = await userCollection.findOne({ email });
      if (!user) {
        return res.send({ message: "User not found" });
      }
      res.send(user);
    });

    // latest products
    app.get("/latest", async (req, res) => {
      const latestProducts = await productCollection
        .find()
        .sort({ productCreationDateTime: -1 })
        .limit(10)
        .toArray();
      res.send(latestProducts);
    });

    // detailed products
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(product);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
