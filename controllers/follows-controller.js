const { Follow, User } = require("../models");
const validator = require('validator');
const bcrypt = require('bcrypt');
const {sign} = require("jsonwebtoken")

module.exports = {

    getFollowers: async(req, res) => {
        const userId = req.body.followeeId;

        try{
            const listOfFollowers = await Todo.findAll({
                where: {
                    followee_id: userId 
                }
            });
            res.status(200).json(listOfFollowers);
        } catch (error){
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    follow: async(req, res) => {
        try{
            const followerId = req.user.id;
            const followeeId = req.body.followeeId;

            await Follow.create({
                follower_id : followerId,
                followee_id : followeeId,
            });
                
            return res.status(201).json({message: "Follow has been added successfully"});
        }   catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"});
        }
    },
    unfollow: async(req, res) => {
        try{
            const followerId = req.user.id;
            const followeeId = req.body.followeeId;

            await Follow.destroy({
                where: {
                    follower_id : followerId,
                    followee_id : followeeId,
                }  
            });
                
            return res.status(200).json({message: "Successfull unfollow"});
        }   catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"});
        }
    }
}


