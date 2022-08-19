const express = require("express");
const dotenv = require("dotenv");

const {chat} = require("./data/data");

const app = express();
dotenv.config();



app.get("/", (req,res)=>{
  res.send("fr api work");
});

app.get("/api/chat", (req,res)=>{
    res.send(chat);
  });

  app.get("/api/chat/:id", (req,res)=>{
    const ca = chat.find((c)=> c._id === req.params.id );
    res.send(ca);
  });
 
const PORT = process.env.PORT || 5000;

app.listen(`${PORT}`, console.log(`server work on P ${PORT}`));
