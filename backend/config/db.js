const mongoose = require("mongoose");

const condb = async()=>{

    try{
      const con = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log( `mogo consed ${con.connection.host}`);
    } catch(error){
    console.log(`erorr ${error.message}`);
    process.exit();
    }

}

module.exports = condb 