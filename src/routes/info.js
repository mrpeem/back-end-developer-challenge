const express = require('express');
const router = express.Router();
const infoController = require('../controllers/info');

/**
 * @swagger
 * tags:
 *   name: Info
 *   description: Character information retrieval
 */

/**
 * @swagger
 * /info/{name}:
 *   get:
 *     summary: Retrieve all information about a character
 *     tags: [Info]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the character to retrieve information for
 *     responses:
 *       200:
 *         description: Character information retrieved successfully
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.get('/:name', infoController.fetchInfo);

/**
 * @swagger
 * /info/{name}/hp:
 *   get:
 *     summary: Retrieve hit points of a character
 *     tags: [Info]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the character to retrieve hit points for
 *     responses:
 *       200:
 *         description: Hit points retrieved successfully. Returns both regular and temporary hit points
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.get('/:name/hp', infoController.fetchHitPoints);

/**
 * @swagger
 * /info/{name}/classes:
 *   get:
 *     summary: Retrieve classes of a character
 *     tags: [Info]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the character to retrieve classes for
 *     responses:
 *       200:
 *         description: Classes retrieved successfully
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.get('/:name/classes', infoController.fetchClasses);

/**
 * @swagger
 * /info/{name}/stats:
 *   get:
 *     summary: Retrieve stats of a character
 *     tags: [Info]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the character to retrieve stats for
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.get('/:name/stats', infoController.fetchStats);

/**
 * @swagger
 * /info/{name}/items:
 *   get:
 *     summary: Retrieve items of a character
 *     tags: [Info]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the character to retrieve items for
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.get('/:name/items', infoController.fetchItems);

/**
 * @swagger
 * /info/{name}/defenses:
 *   get:
 *     summary: Retrieve defenses of a character
 *     tags: [Info]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the character to retrieve defenses for
 *     responses:
 *       200:
 *         description: Defenses retrieved successfully
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.get('/:name/defenses', infoController.fetchDefenses);

module.exports = router; 
