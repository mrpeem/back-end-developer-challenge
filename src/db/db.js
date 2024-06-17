// This file is for handling essential database operations such as
// initializing, table creation, data population, and clean up

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
    let dbExists = true;

    try {
      await fs.access(filepath);
    } catch (error) {
      dbExists = false;
    }

    const db = new sqlite3.Database(filepath);

    if (!dbExists) {
      await createTables(db);
      console.log("Tables created and connection established.");
    } else {
      console.log("Connection with database established.");
    }

    return db;
  } catch (error) {
    throw new Error(`Failed to initialize database connection: ${error.message}`);
  }
};

const query = (db, query, params) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const createTables = async (db) => {
  try {
    console.log("Creating tables...");

    await Promise.all([
      query(db, `
        CREATE TABLE IF NOT EXISTS characters (
          ID            INTEGER PRIMARY KEY AUTOINCREMENT,
          name          VARCHAR(50) NOT NULL,
          level         INTEGER NOT NULL,
          hitPoints     INTEGER NOT NULL,
          tempHitPoints INTEGER
        )`),
      
      query(db, `
        CREATE TABLE IF NOT EXISTS classes (
          ID            INTEGER PRIMARY KEY AUTOINCREMENT,
          characterName VARCHAR(50) NOT NULL,
          name          VARCHAR(50) NOT NULL,
          hitDiceValue  INTEGER NOT NULL,
          classLevel    INTEGER NOT NULL
        )`),

      query(db, `
        CREATE TABLE IF NOT EXISTS stats (
          ID            INTEGER PRIMARY KEY AUTOINCREMENT,
          characterName VARCHAR(50) NOT NULL,
          strength      INTEGER NOT NULL,
          dexterity     INTEGER NOT NULL,
          constitution  INTEGER NOT NULL,
          intelligence  INTEGER NOT NULL,
          wisdom        INTEGER NOT NULL,
          charisma      INTEGER NOT NULL
        )`),

      query(db, `
        CREATE TABLE IF NOT EXISTS items (
          ID             INTEGER PRIMARY KEY AUTOINCREMENT,
          characterName  VARCHAR(50) NOT NULL,
          name           VARCHAR(50) NOT NULL
        )`),

      query(db, `
        CREATE TABLE IF NOT EXISTS modifiers (
          ID             INTEGER PRIMARY KEY AUTOINCREMENT,
          characterName  VARCHAR(50) NOT NULL,
          itemName       VARCHAR(50) NOT NULL,
          affectedObject VARCHAR(50) NOT NULL,
          affectedValue  VARCHAR(50) NOT NULL,
          value          INTEGER NOT NULL
        )`),

      query(db, `
        CREATE TABLE IF NOT EXISTS defenses (
          ID             INTEGER PRIMARY KEY AUTOINCREMENT,
          characterName  VARCHAR(50) NOT NULL,
          type           VARCHAR(50) NOT NULL,
          defense        VARCHAR(50) NOT NULL
        )`)
    ]);

    console.log("All tables created successfully.");
  } catch (error) {
    throw new Error(`Failed to create tables: ${error.message}`);
  }
};

const populate = async (db, data) => {
  const characterName = data.name;

  try {
    const promises = [];

    promises.push(query(db, `
      INSERT INTO characters (name, level, hitPoints, tempHitPoints) VALUES (?, ?, ?, ?)`,
      [characterName, data.level, data.hitPoints, 0]));

    data.classes.forEach(e => {
      promises.push(query(db, `
        INSERT INTO classes (characterName, name, hitDiceValue, classLevel) VALUES (?, ?, ?, ?)`,
        [characterName, e.name, e.hitDiceValue, e.classLevel]));
    });

    promises.push(query(db, `
      INSERT INTO stats 
        (characterName, strength, dexterity, constitution, intelligence, wisdom, charisma) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [characterName, data.stats.strength, data.stats.dexterity, data.stats.constitution,
        data.stats.intelligence, data.stats.wisdom, data.stats.charisma]));

    data.items.forEach(e => {
      promises.push(query(db, `
        INSERT INTO items (characterName, name) VALUES (?, ?)`,
        [characterName, e.name]));

      const modifier = e.modifier;
      promises.push(query(db, `
        INSERT INTO modifiers (characterName, itemName, affectedObject, affectedValue, value) VALUES (?, ?, ?, ?, ?)`,
        [characterName, e.name, modifier.affectedObject, modifier.affectedValue, modifier.value]));
    });

    data.defenses.forEach(e => {
      promises.push(query(db, `
        INSERT INTO defenses (characterName, type, defense) VALUES (?, ?, ?)`,
        [characterName, e.type.toLowerCase(), e.defense.toLowerCase()]));
    });

    await Promise.all(promises);

    console.log("Populated data successfully.");
  } catch (error) {
    throw new Error(`Failed to populate data: ${error.message}`);
  }
};

const cleanup = async (db, characterName) => {
  try {
    await Promise.all([
      query(db, `DELETE FROM characters WHERE name = ?`, [characterName]),
      query(db, `DELETE FROM classes WHERE characterName = ?`, [characterName]),
      query(db, `DELETE FROM stats WHERE characterName = ?`, [characterName]),
      query(db, `DELETE FROM items WHERE characterName = ?`, [characterName]),
      query(db, `DELETE FROM modifiers WHERE characterName = ?`, [characterName]),
      query(db, `DELETE FROM defenses WHERE characterName = ?`, [characterName])
    ])
    
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
