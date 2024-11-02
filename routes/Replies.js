const express = require('express')
const router = express.Router()
const controller = require("../controllers/replies-controller")
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/:postId", validateToken, controller.addReply);
router.get("/:replyId", controller.getReply);
router.put("/:replyId", validateToken, controller.updateReply);
router.patch("/:replyId", validateToken, controller.deleteReply);

module.exports = router;