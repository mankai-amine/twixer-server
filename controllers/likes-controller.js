const { Like } = require("../models");


module.exports = {

    getIsPostLiked: async(req, res) => {
        const postId = req.params.postId;
        const user = req.user;

        try{
            const isLiked = await Like.findOne({
                where: {
                    post_id: postId,
                    user_id: user.id 
                }
            });
            if(isLiked){
                res.status(200).json({isPostLiked:true});
            } else{
                res.status(200).json({isPostLiked:false});
            }
        } catch (error){
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    getReplyLikes: async(req, res) => {
        const replyId = req.body.replyId;

        try{
            const listOfReplyLikes = await Like.findAll({
                where: {
                    reply_id: replyId 
                }
            });
            res.status(200).json(listOfReplyLikes);
        } catch (error){
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    likePost: async(req, res) => {
        try{
            const userId = req.user.id;
            const postId = req.params.postId;

            const existingLike = await Like.findOne({
                where: {
                    user_id: userId,
                    post_id: postId,
                },
            });
            
            if (existingLike) {
                return res.status(400).json({ error: "You have already liked this post." });
            }            

            await Like.create({
                user_id : userId,
                post_id : postId,
                reply_id: null,
            });
                
            return res.status(201).json({message: "Like has been added successfully"});
        }   catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"});
        }
    },
    likeReply: async(req, res) => {
        try{
            const userId = req.user.id;
            const replyId = req.body.replyId;

            await Like.create({
                user_id : userId,
                reply_id : replyId,
            });
                
            return res.status(201).json({message: "Reply has been liked successfully"});
        }   catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"});
        }
    },
    unlikePost: async(req, res) => {
        try{
            const userId = req.user.id;
            const postId = req.params.postId;

            const existingLike = await Like.findOne({
                where: {
                    user_id: userId,
                    post_id: postId,
                },
            });
            
            if (!existingLike) {
                return res.status(400).json({ error: "You didn't like this post anyways." });
            }  

            await Like.destroy({
                where: {
                    user_id : userId,
                    post_id : postId,
                }  
            });
                
            return res.status(200).json({message: "Like has been removed successfully"});
        }   catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"});
        }
    },
    unlikeReply: async(req, res) => {
        try{
            const userId = req.user.id;
            const replyId = req.body.replyId;

            await Like.destroy({
                where: {
                    user_id : userId,
                    reply_id : replyId,
                }  
            });
                
            return res.status(200).json({message: "Like has been removed successfully"});
        }   catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"});
        }
    }
}


