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
                return res.status(400).json({ message: "Post doesn't exist"});
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
        const user = req.user;
        const { postId } = req.params;

        try {
            const requestedPost = await Post.findByPk(postId);
            if (requestedPost === null) {
                return res.status(400).json({message:"Post not found"});
            }

            if( user.role!="admin" && ( parseInt(user.id, 10) !== parseInt(requestedPost.user_id, 10) ) ){
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
    getProfilePage: async(req, res) => {
        const { id } = req.params
        console.log("Received ID:", id);

        try {
            const posts = await Post.findAll({
                where: {
                    user_id: id,
                    is_deleted: 0,
                },
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
                        // might need to limit replies displayed for feed
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
                ],
                group: ['Post.id', 'poster.id', 'replies.id', 'replies->replier.id']
            });

            return res.status(200).json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    getGeneralFeed: async(req, res) => {
        let { page, limit } = req.query;
        if (!page || isNaN(page) || !limit || isNaN(limit)) {
            return res.status(400).json({ message: 'Invalid page or limit' });
        }

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        try {
            const generalPosts = await Post.findAll({
                where: {
                    is_deleted: 0,
                    date: {
                        [Op.gte]: fiveDaysAgo,
                    }
                },
                subQuery: false,
                limit,
                offset: (page - 1) * limit,
                attributes: {
                    include: [
                        [                        
                            sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.post_id = Post.id)'),
                            //sequelize.fn('COUNT', sequelize.col('likes.id')),
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
                        // might need to limit replies displayed for feed
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
                ],
                group: ['Post.id', 'poster.id', 'replies.id', 'replies->replier.id'],
                order: [['date', 'DESC']]
            });

            return res.status(200).json(generalPosts);
        } catch (error) {
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    },
    getFollowFeed: async(req, res) => {
        let { page, limit } = req.query;
        if (!page || isNaN(page) || !limit || isNaN(limit)) {
            return res.status(400).json({ message: 'Invalid page or limit' });
        }

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const currUserId = req.user.id;

        try {
            const userFolloweeIds = await Follow.findAll({
                attributes: ['followee_id'],
                where: {
                    follower_id: currUserId,
                },
                raw: true
            });

            if (!userFolloweeIds.length) {
                return res.status(200).json([]); 
            }

            const followeeIds = userFolloweeIds.map(follow => follow.followee_id);

            const postsByFollowees = await Post.findAll({
                where: {
                    is_deleted: 0,
                    user_id: {
                        [Op.in]: followeeIds
                    },
                    date: {
                        [Op.gte]: fiveDaysAgo
                    }
                },
                subQuery: false,
                limit,
                offset: (page - 1) * limit,
                attributes: {
                    include: [
                        [
                            //sequelize.fn('COUNT', sequelize.col('likes.id')),
                            sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.post_id = Post.id)'),
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
                        // might need to limit replies displayed for feed
                        model: Reply,
                        as: 'replies',
                        attributes: ['content'],
                        separate: true,
                        include: [
                            {
                                model: User,
                                as: 'replier',
                                attributes: ['username']
                            }
                        ]
                    }
                ],
                group: ['Post.id', 'poster.id'],
                order: [['date', 'DESC']]
            });

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
