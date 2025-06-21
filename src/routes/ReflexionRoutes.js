const { Router } = require("express");
const upload = require("../utils/multer.js"); // aquí importas multer
const reflexionController = require("../controllers/ReflexionController");

const router = Router();

router.post("/", upload.single("audio"), reflexionController.createReflexion);
router.get("/", reflexionController.getAllReflexiones);
router.get("/:id", reflexionController.getReflexionById);
router.put("/:id", upload.single("audio"), reflexionController.updateReflexion);
router.delete("/:id", reflexionController.deleteReflexion);

module.exports = router;
