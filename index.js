require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { resolveSoa } = require("dns");
const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@collegebazarcluster.vbcx3j9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const haiku = client.db("CollegeBazar").collection("Colleges_Info2");
const haiku2 = client.db("CollegeBazar").collection("Student_Form_Info");

async function run() {
  try {
    

    app.get("/all", async (req, res) => {
      const allColleges = await haiku.find().toArray();
      res.send(allColleges);
    });

   

    app.get("/all/:id", async (req, res) => {
      const id = req.params.id;
      // const singleCollegeInfo = await haiku.find((each) => each._id == id).toArray();
      const singleCollegeInfo = { _id: new ObjectId(id) };

      const x = await haiku.findOne(singleCollegeInfo);
      res.send(x);
    });

    app.post("/form_to_datababe", async (req, res) => {
      const formInfo = req.body;
      const StudentFormInfo = await haiku2.insertOne(formInfo);
      res.send(StudentFormInfo);
    });
    app.get("/datababe_to_myCollegePage", async (req, res) => {
      const x = await haiku2.find().toArray();
      res.send(x);
    });
    app.get("/datababe_to_myCollegePage/:id", async (req, res) => {
      const y = req.params.id;
      const singleCollegeInfo = { _id: new ObjectId(y) };
      const x = await haiku.findOne(singleCollegeInfo);
      res.send(x);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { candidate_email: email };
      const final = await haiku2.findOne(query);
      res.send(final);
    });

    app.put("/updatingUser/:email", async (req, res) => {
      const email = req.params.email;
      const {candidate_name, candidate_email, address, phone_number} = req.body;
      const final = await haiku2.updateOne( { candidate_email: email },
        { $set: {
        candidate_name: candidate_name,
        candidate_email: candidate_email,
        address: address,
        phone_number: phone_number
      } });
      console.log(req.body)
      res.send(final)
    });
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
