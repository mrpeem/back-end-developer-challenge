# DDB Back End Developer Challenge

[Link to the original README](https://github.com/mrpeem/back-end-developer-challenge/blob/master/README.md)

### Instructions to Run Locally
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server

### API Operations
- The port is 3000. Once the server is running, go to `http://localhost:3000/docs/` to view info about all endpoints this application supports
- To call the endpoints, use cURL, Postman, or any other tools of choice. The endpoints can also be hit directly on the SwaggerUI `(/docs)` as well

### Implementation Details
- Some liberties and assumptions were made in the designing of this application as the original README was not specific about certain details <br>
  1. **Damage**: 
    - The assumption is that hit points will not go below 0, even if the attacking damage is greater than the current HP. After HP value is 0, there is no dying penalty of any kind, and the character can be healed back up normally
    - It is assumed that the following damage types are valid:
      > bludgeoning, piercing, slashing, fire, cold, acid, thunder, lightning, poison, radiant, necrotic, psychic, force

      Any damage types not in this list are considered invalid and an error will be thrown

  2. **Health**: The maximum hit points of a character was never stated. The file `briv.json` shows HP, but it is unclear whether that is the maximum HP for the character at that level. As such, the program is implemented such HPs can be healed up to inifinity

  3. **Temporary hit points**: 
    - It was never stated how long temporary HP lasts. This is what the example states:
      > He finds a magical item that grants him an additional 10 HP during the next fight
    
      As such, it is assumed that temporary HP will only be valid until the next battle/damage-received event and will reset back to 0 even if it is not used up. Consider the following situation: a character has 10 HP and 10 temporary HP. The character receives 5 damage. The character will now be left with 10 HP and 0 temporary HP. 
    - There is also this part regarding the rules about temporary HP:
      > always taking the higher value

      It is assumed that this means that the higher value of the temporary HP will be used. For example, if a character currently has 5 temporary HP, and the endpoint is called again to add 2 temporary HP, the value will remain 5 as it is greater than the value being added. Conversely, if 10 temporary HP are being added, then the new value will be 10

  4. **Database**: This is stated in the description
      > The task requires building a service that ... persists throughout the application's lifetime.

      It is assumed that the data will only need to persist throughout the lifetime of the application and resets. The database used is `SQLite3` and can be found under `src/db/db.db`. This type of data persists regardless of server restarts. However, the choice was made to clean the database upon application exit and reinitialize it for every new run of the application in order to reset to a default state and allow for more thorough testing.

      The database initialization is designed with a singleton principle in mind, so only one connection will be made per server start in order to reduce latency associated with creating a new connection for each call.

      The initialization function also takes into account a fresh start or an application restart. This repo will contain an existing database (`src/db/db.db`), but the file can safely be removed/deleted and it will get recreated and reinitialized upon the next application start. 
  