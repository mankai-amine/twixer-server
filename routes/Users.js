const express = require('express')
const router = express.Router()
const controller = require("../controllers/users-controller")
const { validateToken } = require("../middlewares/AuthMiddleware"); 



router.get("/", validateToken, controller.getUser);
router.get("/:id", controller.getById);
router.post("/", controller.register);
router.post("/login", controller.login);
router.put("/update/:id", validateToken, controller.updateById);
router.put("/password/:id", validateToken, controller.updatePassword);
router.patch("/status/:id", validateToken, controller.banById);


module.exports = router;