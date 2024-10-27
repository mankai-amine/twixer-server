const express = require('express')
const router = express.Router()
const controller = require("../controllers/posts-controller");
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get("/:postId", controller.getPost);
router.post("/", validateToken, controller.addPost);
router.put("/:postId", validateToken, controller.updatePost);
router.delete("/:postId", validateToken, controller.deletePost);


module.exports = router;