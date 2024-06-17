const express = require("express");
const router = express.Router();
const temporaryHPController = require('../controllers/temporaryHP')

router.post('/', temporaryHPController.addTempHP);

module.exports = router;