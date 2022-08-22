const express = require("express");
const dotenv = require("dotenv");
const {chat} = require("./data/data");
const condb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware")


const app = express();
dotenv.config();
condb()

app.use(express.json()); 

app.get("/", (req,res)=>{
  res.send("fr api work");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);


app.use(notFound)
app.use(errorHandler)



 
const PORT = process.env.PORT || 5000;

app.listen(`${PORT}`, console.log(`server work on P ${PORT}`));
