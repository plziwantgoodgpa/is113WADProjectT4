const express = require("express");
const server = express();
const homeRoutes = require("./routes/homeRoutes");

server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");

server.use("/", homeRoutes);

const hostname = "localhost";
const port = 8000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
