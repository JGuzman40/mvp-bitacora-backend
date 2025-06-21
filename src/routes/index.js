const { Router } = require("express");
const userRoutes = require("./UserRoutes");


const router = Router();

router.use("/user", userRoutes);

module.exports = router;