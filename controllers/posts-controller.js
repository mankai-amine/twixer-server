const { User } = require("../models");
// const validator = require('validator');
// const bcrypt = require('bcrypt');
// const {sign} = require("jsonwebtoken")

module.exports = {

    getPost: async(req, res) => {
        try {
            const postId = req.body.id;
            const existingPost = await Post.findOne({
                where: {id: postId},
            include: {model: User, attributes: ['username'] }
        });
            res.status(201).send(existingPost);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" }); 
        }
    },
    addPost: async(req, res) => {
        try {
            // TODO validation here
            await Post.create({
                user_id: req.body.user_Id,
                content: req.body.content,
            });
            res.status(201).send("Success");
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" }); 
        }
    }

}


    // addUser: async(req, res) => {
    //     try{
    //         const { email, password } = req.body;

    //         if(!isUserValid(email, password,req,res)){
    //             return;
    //         }

    //         const existingEmail = await User.findOne({ where: { email } }); 
    //         if (existingEmail) {
    //             return res.status(400).json({ error: "Email already exists" });
    //         }

    //         const hash = await bcrypt.hash(password, 10);

    //         const createdUser = await User.create({
    //                     email: email,
    //                     password: hash,
    //         });
                
    //         return res.status(201).json(createdUser)
    //     }   catch (error){
    //         console.error(error);
    //         return res.status(500).json({error:" Internal server error"});
    //     }
    // }

    // async function isUserValid(email, password, req, res){

    //     if(!validator.isEmail(email)){
    //         res.status(400).send({
    //             error: "Please provide a valid email"
    //         })
    //         return false;
    //     }
    
    //     if(password.length > 50 || password.length < 6){
    //         res.status(400).send({
    //             error: "Password must contain between 6 and 50 characters"
    //         })
    //         return false;
    //     }
    
    //     return true;
    // }