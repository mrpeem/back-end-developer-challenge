const express = require("express");
const router = express.Router();
const damageController = require('../controllers/damage')

/**
 * @swagger
 * tags:
 *   name: Damage
 *   description: Damage management
 */

/**
 * @swagger
 * /damage:
 *   post:
 *     summary: Deal damage to a character
 *     tags: [Damage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the character to deal damage to
 *               damage:
 *                 type: integer
 *                 description: Amount of damage from the attack
 *               type:
 *                 type: string
 *                 description: Type of attack
 *     responses:
 *       200:
 *         description: Damage dealt successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 damageReceived:
 *                   type: integer
 *                   description: Total damage received
 *                 updatedHitPoints:
 *                   type: object
 *                   properties:
 *                     hitPoints:
 *                       type: integer
 *                       description: Current hit points after applying damage
 *                     tempHitPoints:
 *                       type: integer
 *                       description: Current temporary hit points after applying damage
 *                 originalHitPoints:
 *                   type: object
 *                   properties:
 *                     hitPoints:
 *                       type: integer
 *                       description: Previous hit points before applying damage
 *                     tempHitPoints:
 *                       type: integer
 *                       description: Previous temporary hit points before applying damage
 *       400:
 *         description: Missing fields in request body
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.post('/', damageController.damageReceived);

module.exports = router;