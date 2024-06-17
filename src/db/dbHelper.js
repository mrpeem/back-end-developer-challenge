// This file contains all operations performed on the database
// such as select and update

const dbModule = require('./db');

const fetchCharacterInfo = async (characterName) => {
  const query = `SELECT * FROM characters WHERE name = ?`;
  const characters = await dbModule.query(query, [characterName]);
  if (characters && characters.length > 0) {
    return {
      name: characters[0].name,
      level: characters[0].level,
      hitPoints: characters[0].hitPoints,
      tempHitPoints: characters[0].tempHitPoints,
    }
  }
  return null;
}

const fetchHitPoints = async (characterName) => {
  const query = `SELECT hitPoints, tempHitPoints FROM characters WHERE name = ?`;
  const rows = await dbModule.query(query, [characterName]);
  if (rows.length > 0) {
    return {
      hitPoints: rows[0].hitPoints,
      tempHitPoints: rows[0].tempHitPoints
    }
  }
  return null;
}

const updateHitPoints = async (name, hitPointsDelta, tempHitPoints = null) => {
  // the condition for the SET query does two things: 
  // 1) ensure that hitPoints value doesn't go below 0
  // 2) tempHitPoints is also null by default; if no argument is passed in, use the
  //    existing value (no change), otherwise update it to the new value
  const query = `
    UPDATE characters
    SET hitPoints = CASE WHEN hitPoints + ? < 0 THEN 0 ELSE hitPoints + ? END,
        tempHitPoints = CASE WHEN ? IS NOT NULL THEN ? ELSE tempHitPoints END
    WHERE name = ?`;
  
  const params = [hitPointsDelta, hitPointsDelta, tempHitPoints, tempHitPoints, name];

  try {
    await dbModule.query(query, params);
  } catch (error) {
    console.error(`Failed to update hit points for ${name}:`, error.message);
    throw error;
  }
};

const fetchClasses = async (characterName) => {
  const query = `SELECT DISTINCT name, hitDiceValue, classLevel FROM classes WHERE characterName = ?`;
  const classes = await dbModule.query(query, [characterName]);
  return classes.map(c => ({
    name: c.name,
    hitDiceValue: c.hitDiceValue,
    classLevel: c.classLevel
  }));
}

const fetchStats = async (characterName) => {
  const query = `SELECT * FROM stats WHERE characterName = ?`;
  const stats = await dbModule.query(query, [characterName]);
  if (stats && stats.length > 0) {
    return {
      strength: stats[0].strength,
      dexterity: stats[0].dexterity,
      constitution: stats[0].constitution,
      intelligence: stats[0].intelligence,
      wisdom: stats[0].wisdom,
      charisma: stats[0].charisma
    }
  }
  return null;
}

const fetchItems = async (characterName) => {
  const itemsQuery = 
  `SELECT DISTINCT items.name, modifiers.affectedObject, modifiers.affectedValue, modifiers.value 
    FROM items 
    LEFT JOIN modifiers ON items.name = modifiers.itemName 
    WHERE items.characterName = ?`;
  const itemsWithModifiers = await dbModule.query(itemsQuery, [characterName]);
  return itemsWithModifiers.map(item => ({
    name: item.name,
    modifier: item.affectedObject ? {
      affectedObject: item.affectedObject,
      affectedValue: item.affectedValue,
      value: item.value
    } : null
  }));
}

const fetchDefenses = async (characterName) => {
  const defensesQuery = `SELECT DISTINCT type, defense FROM defenses WHERE characterName = ?`;
  const defenses = await dbModule.query(defensesQuery, [characterName]);
  return defenses.map(defense => ({
    type: defense.type,
    defense: defense.defense
  }));
}


module.exports = {
  fetchCharacterInfo,
  fetchClasses,
  fetchStats,
  fetchItems,
  fetchDefenses,
  fetchHitPoints,
  updateHitPoints
}