const express = require('express');
const fs = require('fs');

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

const data = JSON.parse(fs.readFileSync('briv.json', 'utf8'));
let db; 

// initialize, populate database, then start server
(async () => {
  try {
    db = await dbModule.getDbInstance();
    dbModule.populate(db, data);

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
    await dbModule.cleanup(db, data.name);
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
