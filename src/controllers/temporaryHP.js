const dbModule = require('../db/db');
const dbHelper = require('../db/dbHelper');

const addTempHP = async (req, res) => {
  const { name, hitPoints: tempHitPoints } = req.body;
  if (!name || tempHitPoints === undefined) {
    return res.status(400).json({ error: 'Missing required fields in request body.' });
  }

  try {
    const character = await dbHelper.fetchCharacterInfo(name);
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    const hitPointsDelta = 0; // no change to regular hit points, so setting it as 0

    if (tempHitPoints > character.tempHitPoints) {
      await dbHelper.updateHitPoints(name, hitPointsDelta, tempHitPoints);
      const updatedHitPoints = await dbHelper.fetchHitPoints(name);
      res.status(200).json({ 
        message: 'tempHitPoints updated successfully.',
        tempHitPoints: updatedHitPoints.tempHitPoints
      });
    } else {
      res.status(200).json({
        message: 'tempHitPoints not updated as the new value is not greater than the existing value.',
        tempHitPoints: character.tempHitPoints
      });
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to update tempHitPoints.', message: error.message });
  }
}

module.exports = { addTempHP };