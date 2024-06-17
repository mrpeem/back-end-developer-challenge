const express = require('express');
const router = express.Router();
const infoController = require('../controllers/info');

router.get('/:name', infoController.fetchInfo);

router.get('/:name/hp', infoController.fetchHitPoints);

router.get('/:name/classes', infoController.fetchClasses);

router.get('/:name/stats', infoController.fetchStats);

router.get('/:name/items', infoController.fetchItems);

router.get('/:name/defenses', infoController.fetchDefenses);

module.exports = router; 
