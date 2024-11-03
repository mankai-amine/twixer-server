const express = require('express')
const router = express.Router()
const controller = require("../controllers/users-controller")
const { validateToken } = require("../middlewares/AuthMiddleware"); 


router.get("/all", validateToken, controller.getAllUsers);
router.get("/", validateToken, controller.getUser);
router.get("/:id", controller.getById);
router.get("/username/:username", controller.getByUsername);
router.post("/", controller.register);
router.post("/login", controller.login);
router.patch("/role/:id", validateToken, controller.updateRole);
router.put("/update/:id", validateToken, controller.updateById);
router.put("/password/:id", validateToken, controller.updatePassword);
router.patch("/status/:id/ban", validateToken, controller.banById);
router.patch("/status/:id/unban", validateToken, controller.unbanById);




module.exports = router;