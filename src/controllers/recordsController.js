const recordsSchemas = require("../schemas/recordsSchemas");

const RepositoryFactory = require("../repositories");
const { StrategyValidator } = require("../strategies");
const { BasicValidation, PremiumValidation } = require("../strategies/records");

const recordsRepositories = RepositoryFactory.createRepository("record");

async function postRecords(req, res) {
  const record = req.body;
  const userId = req.user.id;
  const { error } = recordsSchemas.recordSchema.validate(record);
  if (error) return res.status(422).send({ errors: error.details[0].message });

  //Aqui ficaria uma função que definiria se o user é premium
  const isUserPremium = Math.random() < 0.5;

  const validator = isUserPremium
    ? new StrategyValidator(new PremiumValidation())
    : new StrategyValidator(new BasicValidation());
  
  const isRecordValid = validator.validate(req.body);

  // Aqui eu aplicaria a regra de negócio de acordo com o resultado da validação

  try {
    const InsertedRecord = await recordsRepositories.createRecord(
      record,
      userId
    );
    res.status(201).send(InsertedRecord);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function getRecords(req, res) {
  const userId = req.user.id;

  try {
    const records = await recordsRepositories.findRecordsByUserId(userId);
    res.send(records);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

module.exports = {
  postRecords,
  getRecords,
};
