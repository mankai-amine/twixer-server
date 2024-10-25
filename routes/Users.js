const express = require('express')
const router = express.Router()
const controller = require("../controllers/users-controller")
const { validateToken } = require("../middlewares/AuthMiddleware"); 



router.get("/", validateToken, controller.getUser);
router.get("/:id", controller.getById);
router.post("/", controller.addUser);
router.post("/login", controller.login);


module.exports = router;