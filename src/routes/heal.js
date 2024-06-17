const express = require("express");
const router = express.Router();
const healController = require('../controllers/heal')

/**
 * @swagger
 * tags:
 *   name: Heal
 *   description: Heal management
 */

/**
 * @swagger
 * /heal:
 *   post:
 *     summary: Heal a character
 *     tags: [Heal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               hitPoints:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Healed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hitPoints:
 *                   type: integer
 *                   description: Updated hit points
 *       400:
 *         description: Missing fields in request body
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.post('/', healController.heal);

module.exports = router;
