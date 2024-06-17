const dbModule = require('../db/db');
const dbHelper = require('../db/dbHelper');

const damageReceived = async (req, res) => {
  const { name, damage, type } = req.body;

  try {
    const db = await dbModule.getDbInstance();

    const character = await dbHelper.fetchCharacterInfo(db, name);
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    const defenses = await dbHelper.fetchDefenses(db, name);
    
    const attack = {damage: damage, type: type};
    const attackDamage = calculateAttackDamage(attack, defenses)
    const hitPointsReduction = calculateHitPointsReduction(character.tempHitPoints, attackDamage);
    
    await dbHelper.updateHitPoints(db, name, -1 * hitPointsReduction, 0);
    const updatedHitPoints = await dbHelper.fetchHitPoints(db, name);

    res.json({
      damageReceived: attackDamage,
      updatedHitPoints: {
        hitPoints: updatedHitPoints.hitPoints,
        tempHitPoints: updatedHitPoints.tempHitPoints
      },
      originalHitPoints: {
        hitPoints: character.hitPoints,
        tempHitPoints: character.tempHitPoints
      }
    });
  } catch (error) {
    res.status(500).json(`error ${error}`)
  }
}

// calculates the total attack damaged after taking into account defenses
const calculateAttackDamage = (attack, defenses) => {
  for (const defense of defenses) {
    if (defense.type === attack.type.toLowerCase()) {
      return (defense.defense === 'immunity') ? 0 : attack.damage / 2;
    }
  }
  return attack.damage;
}

// the total amount of HP loss from the attack, after taking into
// account temporary HP
const calculateHitPointsReduction = (tempHitPoints, damage) => {
  return (tempHitPoints < damage) ? damage - tempHitPoints : 0;
}

module.exports = { damageReceived };
