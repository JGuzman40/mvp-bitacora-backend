const { Router } = require("express");
const { login } = require("../controllers/LoginController");

const router = Router();

router.post("/login", login);

module.exports = router;
