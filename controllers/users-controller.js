const { User } = require("../models");
const validator = require('validator');
const bcrypt = require('bcrypt');
const {sign} = require("jsonwebtoken")

module.exports = {
    
    getUser: async(req, res) => {
        try {
        const userId = req.user.id; 
        const user = await User.findByPk(userId); 

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user }); 
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
    getByUsername: async(req, res) => {
        const { username } = req.params;

        try{
            const user = await User.findOne({where: { username }});
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        } catch (error){
            console.error(error);
            res.status(500).json({error:" Internal server error"});
        }
    },
    register: async(req, res) => {
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
                return res.status(404).json({ error: "User doesn't exist" }); 
            } 

            if(user.account_status == "banned"){
                return res.status(400).json({ error: "You have been banned" }); 

            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(400).json({ error: "Wrong password" }); 
            }

            const accessToken = sign(
                { username: user.username, id: user.id, role:user.role}, 
                process.env.JWT_SECRET
            );
            return res.status(200).json({ accessToken }); 
        } catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"}); 
        }
    },
    updateById: async(req, res) => {
        const userDetails = req.body;
        const { id } = req.params;
        const authUser = req.user;

        try{
            if(parseInt(authUser.id, 10) !== parseInt(id, 10)){
                return res.status(400).json({message:"Request not authorized"});
            }

            const requestedUser = await User.findByPk(id);
            if(requestedUser === null){
                return res.status(400).json({message:"User not found"});
            }

            if(!isUpdatedUserValid(userDetails, req, res)){
                return;
            }

            const updatedUser = await requestedUser.update({
                ...userDetails,
                password: requestedUser.password,   
            });
    
            res.status(200).json(updatedUser);
        } catch (error){
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    updatePassword: async(req, res) => {
        const userPasswords = req.body;
        const { id } = req.params;
        const authUser = req.user;

        try{
            if(parseInt(authUser.id, 10) !== parseInt(id, 10)){
                return res.status(400).json({message:"Request not authorized"});
            }

            const requestedUser = await User.findByPk(id);
            if(requestedUser === null){
                return res.status(400).json({message:"User not found"});
            }

            const isPasswordMatch = await bcrypt.compare(userPasswords.password, requestedUser.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ message: "You entered a wrong password" });
            }

            const newHash = await bcrypt.hash(userPasswords.newPassword, 10);

            await requestedUser.update({ password: newHash });
    
            res.status(200).json({message:" Password updated successfully"});
        } catch (error){
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    updateRole: async (req, res) => {
        const currUser = req.user;
        const { id } = req.params;
        const { role } = req.body;
    
        try {
            if (currUser.role !== 'admin') {
                return res.status(403).json({ message: "Only admins can update roles" });
            }
    
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            user.role = role;
            await user.save();
    
            res.status(200).json({ message: "Role updated successfully", user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    banById: async(req, res) => {
        try{
            const currUser = req.user;
            if(currUser.role !== "admin"){
                return res.status(403).json({message:"Request only possible for admins"});
            }

            const bannedUserId = req.params.id;

            const bannedUser = await User.findByPk(bannedUserId);
            if(bannedUser === null){
                return res.status(404).json({message:"User not found"});
            }

            bannedUser.account_status = "banned";
            await bannedUser.save(); 

            res.status(200).json(bannedUser);
        } catch (error){
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    unbanById: async (req, res) => {
        try {
            const currUser = req.user;
            if (currUser.role !== "admin") {
                return res.status(403).json({ message: "Request only possible for admins" });
            }
    
            const unbannedUserId = req.params.id;
    
            const unbannedUser = await User.findByPk(unbannedUserId);
            if (unbannedUser === null) {
                return res.status(404).json({ message: "User not found" });
            }
    
            unbannedUser.account_status = "active";  
            await unbannedUser.save();
    
            res.status(200).json(unbannedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
    
            const { count, rows } = await User.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['id', 'ASC']], 
            });
    
            const totalPages = Math.ceil(count / limit);
    
            res.status(200).json({
                data: rows,
                pagination: {
                    totalCount: count,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: limit
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
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

    return true;
}

async function isUpdatedUserValid(user, req, res){

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

    const pattern2 = /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;  

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