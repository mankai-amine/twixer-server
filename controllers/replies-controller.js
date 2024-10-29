const { Reply } = require("../models");

module.exports = {

    getReply: async(req, res) => {
        const { id } = req.params;
    
        try {
            const existingReply = await Reply.findByPk(id);
            if (existingReply === null) {
                return res.status(400).json({message:"Reply not found"});
            }

            return res.status(200).json(existingReply);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    addReply: async(req, res) => {
        const currUser = req.user;
        const { postId } = req.params;
        const { content } = req.body;

        try {
            if (!isReplyValid(content, req, res)) {
                return;
            }
            const createdReply = await Reply.create({
                post_id: postId,
                user_id: currUser.id,
                content: content,
            });
            return res.status(201).json(createdReply);
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    updateReply: async(req, res) => {
        const currUser = req.user;
        const { postId } = req.params;
        const { content } = req.body;

        try {
            if (!isReplyEditable(content, currUser, req, res)) {
                return;
            }
            const editedReply = await Reply.update({
                content: content
            });
            return res.status(200).json(editedReply);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    deleteReply: async(req, res) => {
        const currUser = req.user;
        const { id } = req.params;

        try {
            const requestedReply = await Reply.findByPk(id);
            if (requestedReply === null) {
                return res.status(400).json({message:"Reply not found"});
            }

            if(parseInt(currUser.id, 10) !== parseInt(requestedReply.user_id, 10)){
                return res.status(400).json({message:"Request not authorized"});
            }

            requestedReply.content = "This reply was deleted";
            requestedReply.isDeleted = true;
            requestedReply.save();

            return res.status(200).json(requestedPost);

        } catch (error) {
            console.error(error);
            res.status(500).json({message:" Internal server error"});
        }
    }
}

    // helper function
    async function isReplyValid(content, req, res){
        const pattern1 = /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    
        if(content.length > 280 || content.length < 5){
            res.status(400).send({
                error: "Reply must contain between 5 and 280 characters."
            })
            return false;
        }

        if (!pattern1.test(content)) {
            res.status(400).send({
                message: "Reply must contain only alphanumeric characters and general symbols"
            })
            return false;
        }
    
        return true;
    }

    async function isReplyEditable(content, currUser, req, res){
        const pattern1 = /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    
        if (currUser.role !== "PREMIUM") {
            res.status(400).send({
                error: "Must be a Premium user to edit replies"
            })
            return false;
        }

        if(content.length > 280 || content.length < 5){
            res.status(400).send({
                error: "Reply must contain between 5 and 280 characters"
            })
            return false;
        }

        if (!pattern1.test(content)) {
            res.status(400).send({
                message: "Reply must contain only alphanumeric characters and general symbols"
            })
            return false;
        }
    
        return true;
    }