const fs = require("fs").promises;
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const filepath = path.join(__dirname, "db.db");

let dbInstance = null; // singleton pattern instance

const getDbInstance = async () => {
  if (!dbInstance) {
    dbInstance = await initializeDb();
  }
  return dbInstance;
};

const initializeDb = async () => {
  try {
    const db = new sqlite3.Database(filepath);

    try {
      await fs.access(filepath);
      console.log("Connection with database established.");
    } catch (error) {
      await createTables();
      console.log("Tables created and connection established.");
    }
    return db;
  } catch (error) {
    throw new Error(`Failed to initialize database connection: ${error.message}`);
  }
};

const query = async (queryString, params) => {
  try {
    const db = await getDbInstance();

    return new Promise((resolve, reject) => {
      db.all(queryString, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  } catch (err) {
    throw err; 
  }
};

const createTables = async () => {
  try {
    console.log("Creating tables...");

    const createTableQueries = [
      `
        CREATE TABLE IF NOT EXISTS characters (
          ID            INTEGER PRIMARY KEY AUTOINCREMENT,
          name          VARCHAR(50) NOT NULL,
          level         INTEGER NOT NULL,
          hitPoints     INTEGER NOT NULL,
          tempHitPoints INTEGER
        )`,
      `
        CREATE TABLE IF NOT EXISTS classes (
          ID            INTEGER PRIMARY KEY AUTOINCREMENT,
          characterName VARCHAR(50) NOT NULL,
          name          VARCHAR(50) NOT NULL,
          hitDiceValue  INTEGER NOT NULL,
          classLevel    INTEGER NOT NULL
        )`,
      `
        CREATE TABLE IF NOT EXISTS stats (
          ID            INTEGER PRIMARY KEY AUTOINCREMENT,
          characterName VARCHAR(50) NOT NULL,
          strength      INTEGER NOT NULL,
          dexterity     INTEGER NOT NULL,
          constitution  INTEGER NOT NULL,
          intelligence  INTEGER NOT NULL,
          wisdom        INTEGER NOT NULL,
          charisma      INTEGER NOT NULL
        )`,
      `
        CREATE TABLE IF NOT EXISTS items (
          ID             INTEGER PRIMARY KEY AUTOINCREMENT,
          characterName  VARCHAR(50) NOT NULL,
          name           VARCHAR(50) NOT NULL
        )`,
      `
        CREATE TABLE IF NOT EXISTS modifiers (
          ID             INTEGER PRIMARY KEY AUTOINCREMENT,
          characterName  VARCHAR(50) NOT NULL,
          itemName       VARCHAR(50) NOT NULL,
          affectedObject VARCHAR(50) NOT NULL,
          affectedValue  VARCHAR(50) NOT NULL,
          value          INTEGER NOT NULL
        )`,
      `
        CREATE TABLE IF NOT EXISTS defenses (
          ID             INTEGER PRIMARY KEY AUTOINCREMENT,
          characterName  VARCHAR(50) NOT NULL,
          type           VARCHAR(50) NOT NULL,
          defense        VARCHAR(50) NOT NULL
        )`
    ];

    await Promise.all(createTableQueries.map(queryString => query(queryString, [])));

    console.log("All tables created successfully.");
  } catch (error) {
    throw new Error(`Failed to create tables: ${error.message}`);
  }
};

const populate = async (data) => {
  const characterName = data.name;

  try {
    console.log(`Populating data for ${characterName}...`);

    const promises = [];

    const characterQuery = `INSERT INTO characters (name, level, hitPoints, tempHitPoints) VALUES (?, ?, ?, ?)`
    const characterParams = [characterName, data.level, data.hitPoints, 0];
    promises.push(query(characterQuery, characterParams));

    data.classes.forEach(e => {
      const classQuery = `INSERT INTO classes (characterName, name, hitDiceValue, classLevel) VALUES (?, ?, ?, ?)`
      const classParams = [characterName, e.name, e.hitDiceValue, e.classLevel];
      promises.push(query(classQuery, classParams));
    });

    const statsQuery = `
      INSERT INTO stats 
        (characterName, strength, dexterity, constitution, intelligence, wisdom, charisma) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`
    const statsParams = [
      characterName, data.stats.strength, data.stats.dexterity, data.stats.constitution,
      data.stats.intelligence, data.stats.wisdom, data.stats.charisma
    ];
    promises.push(query(statsQuery, statsParams));

    data.items.forEach(e => {
      const itemsQuery = `INSERT INTO items (characterName, name) VALUES (?, ?)`;
      const itemsParams = [characterName, e.name];
      promises.push(query(itemsQuery, itemsParams));

      const modifier = e.modifier;
      const modifierQuery = `INSERT INTO modifiers (characterName, itemName, affectedObject, affectedValue, value) VALUES (?, ?, ?, ?, ?)`;
      const modifierParams = [characterName, e.name, modifier.affectedObject, modifier.affectedValue, modifier.value];
      promises.push(query(modifierQuery, modifierParams));
    });

    data.defenses.forEach(e => {
      const defenseQuery = `INSERT INTO defenses (characterName, type, defense) VALUES (?, ?, ?)`;
      const defenseParams = [characterName, e.type.toLowerCase(), e.defense.toLowerCase()];
      promises.push(query(defenseQuery, defenseParams));
    });

    await Promise.all(promises);

    console.log(`Populated data for ${characterName} successfully.`);
  } catch (error) {
    throw new Error(`Failed to populate data for ${characterName}: ${error.message}`);
  }
};

const cleanup = async (characterName) => {
  try {
    console.log(`Cleaning up data for ${characterName}...`);

    const queries = [
      `DELETE FROM characters WHERE name = ?`,
      `DELETE FROM classes WHERE characterName = ?`,
      `DELETE FROM stats WHERE characterName = ?`,
      `DELETE FROM items WHERE characterName = ?`,
      `DELETE FROM modifiers WHERE characterName = ?`,
      `DELETE FROM defenses WHERE characterName = ?`
    ];

    await Promise.all(queries.map(queryString => query(queryString, [characterName])));

    console.log(`Cleanup for ${characterName} completed successfully.`);
  } catch (error) {
    throw new Error(`Failed to cleanup ${characterName}: ${error.message}`);
  }
};

module.exports = {
  getDbInstance,
  populate,
  query,
  cleanup
};
