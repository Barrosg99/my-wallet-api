const recordsRepositories = require("../repositories/recordsRepositories");
const recordsSchemas = require("../schemas/recordsSchemas");


async function postRecords(req, res) {
    const record = req.body;
    const userId = req.user.id
    const { error } = recordsSchemas.recordSchema.validate(record);
    if (error) return res.status(422).send({ errors: error.details[0].message });
    
    try {
        const InsertedRecord = await recordsRepositories.createRecord(record, userId);
        res.status(201).send(InsertedRecord);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

async function getRecords(req, res) {
    const userId = req.user.id;

    try{
        const records = await recordsRepositories.findRecordsByUserId(userId);
        res.send(records);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

module.exports = {
    postRecords,
    getRecords
}