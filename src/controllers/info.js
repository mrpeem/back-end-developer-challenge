const dbModule = require('../db/db');
const dbHelper = require('../db/dbHelper');

function logErr(res, error, table) {
  res.status(500).json({ 
    message: `Error retrieving data from ${table} table`,
    error: error.message 
  });
}

const fetchInfo = async (req, res) => {
  const characterName = req.params.name;

  try {
    const character = await dbHelper.fetchCharacterInfo(characterName);
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    const [classes, stats, items, defenses] = await Promise.all([
      dbHelper.fetchClasses(characterName), 
      dbHelper.fetchStats(characterName),
      dbHelper.fetchItems(characterName),
      dbHelper.fetchDefenses(characterName)
    ]);

    res.status(200).json({
      ...character,
      classes: classes,
      stats: stats,
      items: items,
      defenses: defenses
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve character information", error: error.message });
  }
}

const fetchHitPoints = async (req, res) => {
  const characterName = req.params.name;

  try {
    const hitPoints = await dbHelper.fetchHitPoints(characterName);
        
    if (hitPoints === null) {
      return res.status(404).json({ error: 'Character not found.' });
    }

    res.status(200).json({
      hitPoints: hitPoints.hitPoints,
      tempHitPoints: hitPoints.tempHitPoints,
    });
  } catch (error) {
    logErr(res, error, 'classes')
  }
}

const fetchClasses = async (req, res) => {
  const characterName = req.params.name;

  try {
    const character = await dbHelper.fetchCharacterInfo(characterName);
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    const classes = await dbHelper.fetchClasses(characterName);

    res.status(200).json({classes: classes});
  } catch (error) {
    console.error("Error retrieving data from tables:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const fetchStats = async (req, res) => {
  const characterName = req.params.name;

  try {
    const character = await dbHelper.fetchCharacterInfo(characterName);
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    const stats = await dbHelper.fetchStats(characterName);

    res.status(200).json({stats: stats});
  } catch (error) {
    logErr(res, error, 'stats')
  }
}

const fetchItems = async (req, res) => {
  const characterName = req.params.name;

  try {
    const character = await dbHelper.fetchCharacterInfo(characterName);
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    const items = await dbHelper.fetchItems(characterName);

    res.status(200).json({items: items});
  } catch (error) {
    logErr(res, error, 'items')
  }
}

const fetchDefenses = async (req, res) => {
  const characterName = req.params.name;

  try {
    const character = await dbHelper.fetchCharacterInfo(characterName);
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    const defenses = await dbHelper.fetchDefenses(characterName);

    res.status(200).json({defenses: defenses});
  } catch (error) {
    logErr(res, error, 'defenses')
  }
}

module.exports = {
  fetchInfo,
  fetchHitPoints,
  fetchClasses,
  fetchStats,
  fetchItems,
  fetchDefenses
};
