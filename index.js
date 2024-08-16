const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kdhebsc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://luxe-view.web.app",
      "https://luxe-view.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: "1",
    strict: false,
  },
});
async function run() {
  try {
    // await client.connect();
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

    // update user
    app.patch("/update-user", async (req, res) => {
      try {
        const { email, name, photoURL } = req.body;
        const result = await userCollection.updateOne(
          { email: email },
          { $set: { name, photoURL: photoURL } },
          { upsert: true }
        );
        const message =
          result.upsertedCount > 0
            ? "User created successfully"
            : "User updated successfully";

        res.send({ message });
      } catch (error) {
        res.send({
          message: "An error occurred while updating the user",
          error,
        });
      }
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

    // get products with pagination, search, price filter, and sort
    app.get("/products", async (req, res) => {
      try {
        const {
          search = "",
          minPrice = 0,
          maxPrice = 500,
          sort = "price-asc",
          brand = "",
          page = 1,
          limit = 10,
        } = req.query;
        const skip = (page - 1) * limit;

        const query = {
          productName: { $regex: search, $options: "i" },
          brand: { $regex: brand, $options: "i" },
          price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
        };

        const sortOptions = {
          "price-asc": { price: 1 },
          "price-desc": { price: -1 },
          "date-desc": { productCreationDateTime: -1 },
        };

        const products = await productCollection
          .find(query)
          .sort(sortOptions[sort])
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .toArray();

        const totalProducts = await productCollection.countDocuments(query);

        res.json({
          products,
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: parseInt(page),
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // get all brand
    app.get("/brands", async (req, res) => {
      const brands = await productCollection.distinct("brand");
      res.send(brands);
    });

    // await client.db("admin").command({ ping: 1 });
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
