const { Op } = require("sequelize");
const { User, Post, Like, Reply, Follow, sequelize } = require("../models");

module.exports = {

    getPost: async(req, res) => {
        const { postId } = req.params;

        try {
            const existingPost = await Post.findOne({
                where: {id: postId},
                attributes: {
                    include: [
                        [
                            sequelize.fn('COUNT', sequelize.col('likes.id')),
                            'likeCount'
                        ]
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'poster',
                        attributes: ['username']
                    },
                    {
                        model: Like,
                        as: 'likes',
                        attributes: [],
                    },
                    {
                        model: Reply,
                        as: 'replies',
                        attributes: ['content'],
                        include: [
                            {
                                model: User,
                                as: 'replier',
                                attributes: ['username']
                            }
                        ]
                    }
                    // might need additional logic on reply later for nested replies.
                    // might also add more includes for things like reposting
                ],
                group: ['Post.id', 'poster.id', 'replies.id', 'replies->replier.id']
            });
            if (existingPost === null) {
                return res.status(400).json({ message: "Post does not exist"});
            }
            return res.status(200).json(existingPost);
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
            const createdPost = await Post.create({
                user_id: currUser.id,
                content: content,
            });
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
            const requestedPost = await Post.findByPk(id);
            if (requestedPost === null) {
                return res.status(400).json({message:"Post not found"});
            }

            if(parseInt(currUser.id, 10) !== parseInt(requestedPost.user_id, 10)){
                return res.status(400).json({message:"Request not authorized"});
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
            const requestedPost = await Post.findByPk(id);
            if (requestedPost === null) {
                return res.status(400).json({message:"Post not found"});
            }

            if(parseInt(currUser.id, 10) !== parseInt(requestedPost.user_id, 10)){
                return res.status(400).json({message:"Request not authorized"});
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

        try {
            const existingUser = await User.findOne({
                where: {username: username}
            });
            if (existingUser === null) {
                return res.status(400).json({message:"User not found"});
            }
            const allPostsByUser = await Post.findAll({
                where: {user_id: existingUser.id}
            });
            if (allPostsByUser === null) {
                return res.status(200).json({message:"There are no posts by this user"});
            }

            return res.status(200).json(allPostsByUser);     
        } catch (error) {
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    getGeneralFeed: async(req, res) => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        try {
            const generalPosts = await Post.findAll({
                where: {
                    date: {
                        [Op.gte]: threeDaysAgo
                    }
                },
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
                        // might need to limit replies displayed for feed
                        model: Reply,
                        attributes: ['content'],
                        include: [
                            {
                                modlel: User,
                                attributes: ['username']
                            }
                        ]
                    }
                ],
                group: ['Post.id', 'User.id']
            });
            if (generalPosts === null) {
                return res.status(200).json({message:"There are no recent posts"});
            }

            return res.status(200).json(generalPosts);
        } catch (error) {
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    getFollowFeed: async(req, res) => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const currUserId = req.user.id;

        try {
            const userFolloweeIds = await Follow.findAll({
                attributes: ['followee_id'],
                where: {follower_id: currUserId},
            });
            if (userFolloweeIds === null) {
                return res.status(200).json({message:"User is not following anyone"});
            }

            const postsByFollowees = await Post.findAll({
                where: {
                    user_id: {
                        [Op.in]: userFolloweeIds
                    },
                    date: {
                        [Op.gte]: threeDaysAgo
                    }
                },
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
                        // might need to limit replies displayed for feed
                        model: Reply,
                        attributes: ['content'],
                        include: [
                            {
                                modlel: User,
                                attributes: ['username']
                            }
                        ]
                    }
                ],
                group: ['Post.id', 'User.id']
            });
            if (postsByFollowees === null) {
                return res.status(200).json({message:"Followees do not have any recent posts"});
            }

            return res.status(200).json(postsByFollowees);
        } catch (error) {
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    }

}

    // helper function
    async function isPostValid(content, currUser, req, res){
        const pattern1 = /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    
        if (currUser.role !== "PREMIUM") {
            if(content.length > 280 || content.length < 10){
                res.status(400).send({
                    error: "Post must contain between 10 and 280 characters. Upgrade to Premium for a higher character count."
                })
                return false;
            }
        } else {
            if(content.length > 560 || content.length < 10){
                res.status(400).send({
                    error: "Post must contain between 10 and 560 characters"
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
                error: "Post must contain between 10 and 560 characters"
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
