const express = require('express')
const router = express.Router()
const controller = require("../controllers/follows-controller")
const { validateToken } = require("../middlewares/AuthMiddleware"); 



router.get("/:followeeId", controller.getFollowers);
router.post("/:followeeId", validateToken, controller.follow);
router.delete("/:followeeId", validateToken, controller.unfollow);


module.exports = router;