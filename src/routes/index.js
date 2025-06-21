const { Router } = require("express");
const userRoutes = require("./UserRoutes");
const reflexionRoutes = require("./ReflexionRoutes");


const router = Router();

router.use("/user", userRoutes);
router.use("/reflexion", reflexionRoutes);

module.exports = router;