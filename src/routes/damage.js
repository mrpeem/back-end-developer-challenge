const express = require("express");
const router = express.Router();
const damageController = require('../controllers/damage')

router.post('/', damageController.damageReceived);

module.exports = router;