require("dotenv").config();
// required files
const postRoutes = require("./routes/posts")
const posts = require("./models/posts");
const dbConnect = require("./dbConnect")
//required dependencies
const express = require("express");
const app = express();
const cors = require("cors");

dbConnect();

app.use(express.json());
app.use(cors());

//api calls
app.use("/apis", postRoutes);

const port = process.env.PORT || 8080;
app.listen(port,()=>console.log(`listening on port ${port}...`))