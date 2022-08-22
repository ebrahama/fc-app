const asyncHandler = require("express-async-handler");
const User = require("../Models/usermod");
const generateToken = require("../config/genretoken")

const registerUser = asyncHandler( async (req,res)=>{

    const {name , email, password ,pic } = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("please o enter all the feild");
    }
   
    const userExist= await User.findOne({email});
    if(userExist){
        res.status(400);
        throw new Error("user already exists");
    }
 
    const user = await User.create({
    name,
    email,
    password,
    pic,
    });
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }else {
        res.status(400);
        throw new Error("User not found");
      }
});


const authUser = asyncHandler(async (req,res) => {
const {email, password} = req.body;

const user = await User.findOne({email , password});

       if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
         });
        } else {
            res.status(401);
            throw new Error("invalid email or passwoed");
          }
});


const allUsers = asyncHandler( async(req,res)=>{
const keyword = req.query.search
? {
    $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
    ],
    }
: {};

const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
res.send(users);
});

module.exports ={registerUser , authUser ,allUsers}