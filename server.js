const express = require("express");
const server = express();
const { reqLogger } = require("./middleware/eventsLogger.js");
const path = require('path')
const CORS = require('./config/corsConfigurations.js')
const cookieParser = require('cookie-parser')
const verifyJWTs = require("./middleware/verifyJWTs.js");


const PORT = process.env.PORT || 3500;

// logging the events
server.use(reqLogger); 

server.use(CORS) 

server.use(express.urlencoded({ extended: false }));
server.use(express.json())
server.use(cookieParser())

server.use("/", express.static("public")); 

server.use("/", require("./routes/main")); 
server.use('/register', require('./routes/register.js'))
server.use('/login', require('./routes/login.js'))
server.use('/refresh', require('./routes/refresh.js'))

server.use(verifyJWTs)
server.use('/employees', require("./routes/api/employees.js"))

server.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
