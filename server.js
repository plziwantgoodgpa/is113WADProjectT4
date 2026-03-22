const express = require("express");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const server = express();
const songRoutes = require("./routes/songRoutes");

// Specify the path to the environment variablef file 'config.env'
dotenv.config({ path: './config.env' });
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");

//Routes
server.use("/", songRoutes);

// async function to connect to DB
async function connectDB() {
  try {
    // connecting to Database with our config.env file and DB is constant in config.env
    console.log(process.env.DB)
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

function startServer() {
  const hostname = "localhost"; // Define server hostname
  const port = 8000;// Define port number

  // Start the server and listen on the specified hostname and port
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

// call connectDB first and when connection is ready we start the web server
connectDB().then(startServer);
