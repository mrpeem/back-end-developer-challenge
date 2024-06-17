const express = require("express");
const router = express.Router();
const healController = require('../controllers/heal')

router.post('/', healController.heal);

module.exports = router;
