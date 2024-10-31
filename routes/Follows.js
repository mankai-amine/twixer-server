const express = require('express')
const router = express.Router()
const controller = require("../controllers/follows-controller")
const { validateToken } = require("../middlewares/AuthMiddleware"); 



router.get("/followers/:followeeId", controller.getFollowers);
router.get("/following/:followerId", controller.getFollowing);
router.get("/isFollowing/:followeeId", validateToken, controller.getIsFollowing);
router.post("/:followeeId", validateToken, controller.follow);
router.delete("/:followeeId", validateToken, controller.unfollow);


module.exports = router;