const { User } = require("../models");
const validator = require('validator');
const bcrypt = require('bcrypt');
const {sign} = require("jsonwebtoken")

module.exports = {
    /* Inside this function, we use req.user, which is expected to contain the authenticated user's information. 
    This is populated by middleware that verifies the accessToken from the incoming request headers.*/
    getUser: async(req, res) => {
        try {
            res.json({ user: req.user }); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" }); 
        }
    },
    getById: async(req, res) => {
        const id = req.params.id;

        try{
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        } catch (error){
            console.error(error);
            res.status(500).json({error:" Internal server error"});
        }
    },
    addUser: async(req, res) => {
        try{
            const user = req.body;

            if(!isUserValid(user,req,res)){
                return;
            }

            const existingUsername = await User.findOne({ where: { username: user.username } }); 
            if (existingUsername) {
                return res.status(400).json({ error: "Username already exists" });
            }

            const existingEmail = await User.findOne({ where: { email: user.email } }); 
            if (existingEmail) {
                return res.status(400).json({ error: "Email already exists" });
            }

            const hash = await bcrypt.hash(user.password, 10);

            const createdUser = await User.create({
                ...user,    
                password: hash, 
            });
                
            return res.status(201).json(createdUser)
        }   catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"});
        }
    },
    login: async(req, res) => {
        try{
            const { username, password } = req.body;

            const user = await User.findOne({ where: { username: username}});

            if(!user){
                return res.status(404).json({ error: "User doesn't exist" }); // 404 Not Found
            } 

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(400).json({ error: "Wrong password" }); // 400 Bad Request
            }

            const accessToken = sign(
                { username: user.username, id: user.id}, 
                "importantsecret"
            );
            return res.status(200).json({ accessToken }); 
        } catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"}); // 500 Internal Server Error
        }
    }
}


async function isUserValid(user, req, res){

    if(!validator.isEmail(user.email)){
        res.status(400).send({
            error: "Please provide a valid email"
        })
        return false;
    }

    if(user.email.length > 255 ){
        res.status(400).send({
            error: "Email should not exceed 255 characters"
        })
        return false;
    }

    if(user.username.length > 50 || user.username.length < 2){
        res.status(400).send({
            error: "Username must contain between 2 and 50 characters"
        })
        return false;
    }

    const pattern1 = /^[a-zA-Z0-9]+$/;          

    if(!pattern1.test(user.username)){
        res.status(400).send({
            message: "Username must contain only alphanumeric characters"
        })
        return false;
    }

    if(user.password.length > 60 || user.password.length < 6){
        res.status(400).send({
            error: "Password must contain between 6 and 60 characters"
        })
        return false;
    }

    const pattern2 = /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;  

    if(!pattern2.test(user.password)){
        res.status(400).send({
            message: "Password must contain only alphanumeric characters and general symbols"
        })
        return false;
    }

    if(user.bio.length > 160 || user.bio.length < 10){
        res.status(400).send({
            error: "Bio must contain between 10 and 160 characters"
        })
        return false;
    }

    if(!pattern2.test(user.bio)){
        res.status(400).send({
            message: "Bio must contain only alphanumeric characters and general symbols"
        })
        return false;
    }

    return true;
}
