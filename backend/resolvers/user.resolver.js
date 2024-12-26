import { users } from "../dummyData/data.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const userResolver = {
        Mutation: {
            signUp: async(_,{input},context) => {
                try{
                    const{username,name,password,gender} = input;
                    if(!username || !name || !password || !gender){
                        throw new Error("Missing required fields"); 
                    }
                    const existingUser = await User.findOne({username});
                    if (existingUser){
                        throw new Error("User already exists");
                    }
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password,salt);

                    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

                    const newUser = new User({
                        username,
                        name,
                        password: hashedPassword,
                        gender,
                        profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
                    });

                    await newUser.save();
                    await context.login(newUser);
                    return newUser;
                }catch(err){
                    console.error("Error in SignUp: ", err);
                    throw new Error(err.message || "Internal server error");
                }
            },
            login: async(_,{input},context) => {
                try{
                    const{username,password} = input;
                    const {user} = await context.authenticate("graphql-local", {username,password});
                    await context.login(user);
                    return user;
                }catch(err){
                    console.error("Error in Login: ", err);
                    throw new Error(err.message || "Internal server error");
                }
            },
            logout: async(_,_, context)=>{
                try{
                    await context.logout();
                    req.session.destroy ((err)=>{
                        if(err) throw err;  
                    });
                    res.clearCookie("connect.sid");
                    return {message: "Logout successful"};
                }catch(err){
                    console.error("Error in Logout: ", err);
                    throw new Error(err.message || "Internal server error");
                }
            },
        },

    Query: {
        authUser: async(_,_,context)=>{
            try{
                const user = await context.getUser()
                return user;
            }catch(err){
                console.error("Error in authUser: ", err);
                throw new Error(err.message || "Internal server error");
            }
        },
        user: async(_,{userId}) => {
           try {
            const user = await User.findById(userId);
            return user;
           }catch(err){
            console.error("Error in user query: ", err);
            throw new Error(err.message || "Internal server error");
           }
        },
    },
    //todo add user/transaction relation
};

export default userResolver;