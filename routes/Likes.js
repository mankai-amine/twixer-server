const express = require('express')
const router = express.Router()
const controller = require("../controllers/likes-controller")
const { validateToken } = require("../middlewares/AuthMiddleware"); 



router.get("/isLiked/:postId", validateToken, controller.getIsPostLiked);
router.get("/:replyId", controller.getReplyLikes);

router.post("/:postId", validateToken, controller.likePost);
router.post("/:replyId", validateToken, controller.likeReply);

router.delete("/:postId", validateToken, controller.unlikePost);
router.delete("/:replyId", validateToken, controller.unlikeReply);


module.exports = router;