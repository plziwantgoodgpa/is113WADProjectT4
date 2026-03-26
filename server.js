const dns = require("node:dns")
dns.setServers(['1.1.1.1','8.8.8.8'])
const express = require("express");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const server = express();
const userRoutes = require("./routes/userRoutes")
const songRoutes = require("./routes/songRoutes");
const reviewRoutes = require("./routes/reviewRoutes")
const playlistRoutes = require("./routes/playlistRoutes");
const homeRoutes = require("./routes/homeRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const session = require("express-session");
// Specify the path to the environment variablef file 'config.env'
dotenv.config({ path: './config.env' });
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use(session({
  secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
server.use(express.static('public'));
//Routes
server.use("/",homeRoutes)
server.use("/song", songRoutes);
server.use("/review", reviewRoutes)
server.use("/playlist", playlistRoutes);
server.use("/category", categoryRoutes);
server.use('/user',userRoutes)
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
// startServer()