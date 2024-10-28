const { Like } = require("../models");


module.exports = {

    getPostLikes: async(req, res) => {
        const postId = req.body.postId;

        try{
            const listOfPostLikes = await Like.findAll({
                where: {
                    post_id: postId 
                }
            });
            res.status(200).json(listOfPostLikes);
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
            const postId = req.body.postId;

            await Like.create({
                user_id : userId,
                post_id : postId,
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
                
            return res.status(201).json({message: "Reply has been added successfully"});
        }   catch (error){
            console.error(error);
            return res.status(500).json({error:" Internal server error"});
        }
    },
    unlikePost: async(req, res) => {
        try{
            const userId = req.user.id;
            const postId = req.body.postId;

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


