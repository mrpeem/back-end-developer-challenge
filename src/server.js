const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const dbModule = require('./db/db');

const damageRoutes = require('./routes/damage');
const healRoutes = require('./routes/heal');
const temporaryHPRoutes = require('./routes/temporaryHP');
const infoRoutes = require('./routes/info');

const swaggerDocs = require('./swagger');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/damage', damageRoutes);
app.use('/heal', healRoutes);
app.use('/temporary-hp', temporaryHPRoutes);
app.use('/info', infoRoutes);

// read all json files in configs directory and ignore configs with duplicate names
const loadConfigs = () => {
  const configsDir = path.join(__dirname, 'configs');
  const files = fs.readdirSync(configsDir);
  const configs = files.map(file => {
    const filePath = path.join(configsDir, file);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  });
  const uniqueCharacter = {};
  return configs.reduce((acc, character) => {
    if (!uniqueCharacter[character.name]) {
      uniqueCharacter[character.name] = true;
      acc.push(character);
    }
    return acc;
  }, []);
}
const configs = loadConfigs();

// initialize, populate database, then start server
(async () => {
  try {
    const db = await dbModule.getDbInstance();
    await Promise.all(configs.map(config => dbModule.populate(config)));

    // start server after valid database connection
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);  
      swaggerDocs(app, PORT);
    });
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
  }
})();

// clean up db for next run
const cleanup = async () => {
  console.log("Cleaning up...");
  try {
    await Promise.all(configs.map(config => dbModule.cleanup(config.name)));
    console.log("Cleanup successful.");
  } catch (err) {
    console.error("Error cleaning up:", err);
  }
}

const handleExit = async (signal) => {
  console.log(`${signal} signal received.`);
  cleanup().then(() => {
    if (signal === 'SIGUSR2') {
      process.kill(process.pid, 'SIGUSR2'); // for nodemon restart
    } else {
      process.exit(0);
    }
  });
}

// handler for process exit and termination signals
['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach(signal => {
  process.once(signal, () => handleExit(signal));
});
