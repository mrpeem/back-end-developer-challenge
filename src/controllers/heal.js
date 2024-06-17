const dbModule = require('../db/db');
const dbHelper = require('../db/dbHelper');

const heal = async (req, res) => {
  const { name, hitPoints } = req.body;

  if (!name || !hitPoints) {
    return res.status(400).json({ error: 'Missing required fields in request body.' });
  }

  try {
    const db = await dbModule.getDbInstance();
    await dbHelper.updateHitPoints(db, name, hitPoints);
    const updatedHitPoints = await dbHelper.fetchHitPoints(db, name);

    res.status(200).json({ hitPoints: updatedHitPoints.hitPoints });
  } catch (error) {
    res.status(500).json({ message: 'Failed to perform heal operation', error: error.message });
  }
};

module.exports = { heal };
