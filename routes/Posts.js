const express = require('express')
const router = express.Router()
const controller = require("../controllers/posts-controller");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/:postId", controller.getPost);
router.post("/", validateToken, controller.addPost);
router.put("/:postId", validateToken, controller.updatePost);
router.patch("/:postId", validateToken, controller.deletePost);
router.get("/users/:username", controller.getUserPosts);
router.get("/generalFeed", validateToken, controller.getGeneralFeed);
router.get("/followFeed", validateToken, controller.getFollowFeed);


module.exports = router;