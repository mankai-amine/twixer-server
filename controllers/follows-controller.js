const { Follow, User } = require("../models");

module.exports = {

    getFollowers: async(req, res) => {
        const { followeeId } = req.params;
        console.log("Received id:", followeeId); 

        try{
            const listOfFollowers = await Follow.findAll({
                where: {
                    followee_id: followeeId 
                },
                include: [
                    {
                        model: User, 
                        as: 'follower', 
                        attributes: [ 'username']
                    }
                ]
            });
            res.status(200).json(listOfFollowers || []);
        } catch (error){
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    getFollowing: async(req, res) => {
        const { followerId } = req.params;
        console.log("Received id:", followerId); 

        try{
            const listOfFollowing = await Follow.findAll({
                where: {
                    follower_id: followerId 
                },
                include: [
                    {
                        model: User, 
                        as: 'followee', 
                        attributes: [ 'username']
                    }
                ]
            });
            res.status(200).json(listOfFollowing || []);
        } catch (error){
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    getIsFollowing: async(req, res) => {
        try{
            const followerId  = req.user.id;
            const { followeeId } = req.params;

            const follow = await Follow.findOne({
                where: {
                    follower_id : followerId,
                    followee_id: followeeId, 
                }
            })

            if(follow){
                return res.status(200).json({isFollowing: true});
            } else{
                return res.status(200).json({isFollowing: false});
            }
                
        }   catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"});
        }
    },
    follow: async(req, res) => {
        try{
            const followerId = req.user.id;
            const followeeId = req.params.followeeId;

            const follow = await Follow.findOne({
                where: {
                    follower_id : followerId,
                    followee_id: followeeId, 
                }
            })

            if(follow){
                return res.status(400).json({error:"The follow relation already exists"});
            }

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
            const followeeId = req.params.followeeId;

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


