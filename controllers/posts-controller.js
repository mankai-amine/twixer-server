const { User, Post, Like, Reply } = require("../models");
// const validator = require('validator');

module.exports = {

    getPost: async(req, res) => {
        const { id } = req.params;

        try {
            const existingPost = await Post.findOne({
                where: {id: id},
                attributes: {
                    include: [
                        [
                            sequelize.fn('COUNT', sequelize.col('Likes.id')),
                            'likeCount'
                        ]
                    ]
                },
                include: [
                    {
                        model: User,
                        attributes: ['username']
                    },
                    {
                        model: Like,
                        attributes: [],
                    },
                    {
                        model: Reply,
                        attributes: ['content'],
                        include: [
                            {
                                model: User,
                                attributes: ['username']
                            }
                        ]
                    }
                    // might need additional logic on reply later for nested replies.
                    // might also add more includes for things like reposting
                ]
            });
            if (existingPost === null) {
                return res.status(400).json({ message: "Post does not exist"});
            }
            return res.status(201).json(existingPost);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" }); 
        }
    },
    addPost: async(req, res) => {
        const currUser = req.user;
        const { content } = req.body;

        try {
            if (!isPostValid(content, currUser, req, res)) {
                return;
            }
            const createdPost = await Post.create(post);
            return res.status(201).json(createdPost);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" }); 
        }
    },
    updatePost: async(req, res) => {
        const currUser = req.user;
        const { content } = req.body;
        const { id } = req.params;

        try {
            if(parseInt(currUser.id, 10) !== parseInt(id, 10)){
                return res.status(400).json({message:"Request not authorized"});
            }

            const requestedPost = await Post.findByPk(id);
            if (requestedPost === null) {
                return res.status(400).json({message:"Post not found"});
            }

            if (!isPostEditable(content, currUser, req, res)) {
                return;
            }
            const editedPost = await Post.update({
                content: content
            });

            return res.status(200).json(editedPost);
        } catch (error) {
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    deletePost: async(req, res) => {
        const currUser = req.user;
        const { id } = req.params;

        try {
            if(parseInt(currUser.id, 10) !== parseInt(id, 10)){
                return res.status(400).json({message:"Request not authorized"});
            }

            const requestedPost = await Post.findByPk(id);
            if (requestedPost === null) {
                return res.status(400).json({message:"Post not found"});
            }

            requestedPost.content = "This post was deleted";
            requestedPost.is_deleted = true;
            requestedPost.save();

            return res.status(200).json(requestedPost);
        } catch (error) {
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    getUserPosts: async(req, res) => {
        const { username } = req.params;
        const currUser = req.user;

        try {
            const existingUser = await User.findOne({
                where: {username: currUser.username}
            });
            if (existingUser === null) {
                return res.status(400).json({message:"User not found"});
            }

            
        } catch (error) {
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    }

}

    async function isPostValid(content, currUser, req, res){
        const pattern1 = /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    
        if (currUser.role !== "PREMIUM") {
            if(content.length > 280 || content.length < 5){
                res.status(400).send({
                    error: "Post must contain between 5 and 280 characters. Upgrade to Premium for a higher character count."
                })
                return false;
            }
        } else {
            if(content.length > 560 || content.length < 5){
                res.status(400).send({
                    error: "Post must contain between 5 and 560 characters"
                })
                return false;
            }
        }

        if (!pattern1.test(content)) {
            res.status(400).send({
                message: "Post must contain only alphanumeric characters and general symbols"
            })
            return false;
        }
    
        return true;
    }

    async function isPostEditable(content, currUser, req, res){
        const pattern1 = /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    
        if (currUser.role !== "PREMIUM") {
            res.status(400).send({
                error: "Must be a Premium user to edit posts"
            })
            return false;
        }

        if(content.length > 560 || content.length < 5){
            res.status(400).send({
                error: "Post must contain between 5 and 560 characters"
            })
            return false;
        }

        if (!pattern1.test(content)) {
            res.status(400).send({
                message: "Post must contain only alphanumeric characters and general symbols"
            })
            return false;
        }
    
        return true;
    }