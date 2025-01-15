import userModel from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) =>{
    return jwt.sign({id},"HARTIK_LUHAR", {expiresIn : '1m'});
}

const registerUser = async(req,res) =>{

    try{

        const {name, email, password, role} = req.body;

        //check is user already exist
        const user = await userModel.findOne({email : email});
        console.log(user);

        if(user){
            return res.json({success : false, message : "User already exist!"});
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        console.log(hashedPassword);

        //create new user if it doesn't exist

        const newUser = new userModel({
            name, email,  password : hashedPassword, role
        })

        //create token for newUser
        const _id = newUser._id;
        const token = createToken(_id);



        await newUser.save();

        return res.json({success : true, name : name, message : `Welcome ${name}!`, token : token});

    }
    catch(err){
        return res.json({error : err.message});
    }
}


const loginUser = async(req,res) =>{

    try{

        //check if user exist or not
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        // console.log(user);

        if(!user){
            return res.json({success : false, message : "User doesn't exist, Please register"});
        }

        // check if password is correct
        const isCorrect = await bcrypt.compare(password,user.password);
        // console.log(isCorrect);

        if(!isCorrect){
            return res.json({success : false, message : "Password is incorrect!"});
        }

        const token = createToken(user._id);
        console.log(token);

        return res.json({success : true, name : user.name, message : `Welcome ${user.name}!`, token : token});

    }
    catch(err){
        return res.json({success : false, message : err.message});
    }

}


const getUsers = async(req,res) =>{

    try{
        const userID = req._id;
        const users = await userModel.find({_id : {$ne : userID}});

        if(!users){
            return res.json({success : false, message : "Error fetching users!"});
        }

        return res.json({success : true, users : users});
    }

    catch(error){
        return res.json({success : false, message : error.message});
    }
}


export {registerUser, loginUser, getUsers};