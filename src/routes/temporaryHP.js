const express = require("express");
const router = express.Router();
const temporaryHPController = require('../controllers/temporaryHP');

/**
 * @swagger
 * tags:
 *   name: Temporary HP
 *   description: Temporary HP management
 */

/**
 * @swagger
 * /temporary-hp:
 *   post:
 *     summary: Add temporary hit points to a character
 *     tags: [Temporary HP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the character to add temporary hit points to
 *               hitPoints:
 *                 type: integer
 *                 description: The number of temporary hit points to add
 *     responses:
 *       200:
 *         description: Temporary hit points applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message stating whether or not temporary hit points was applied
 *                 tempHitPoints:
 *                   type: integer
 *                   description: Updated temporary hit points
 *       400:
 *         description: Missing fields in request body
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.post('/', temporaryHPController.addTempHP);

module.exports = router;
