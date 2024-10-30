const express = require('express')
const router = express.Router()
const controller = require("../controllers/uploads-controller")
const { validateToken } = require("../middlewares/AuthMiddleware"); 

router.post("/presignedUrl", validateToken, controller.generatePresignedUrl);
router.post("/uploadImage", validateToken, controller.upload);


module.exports = router;