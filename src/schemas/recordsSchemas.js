const Joi = require('joi');

const recordSchema = Joi.object({
    transaction: Joi.number().min(0).required(),
    description: Joi.string().max(18).required(),
    type: Joi.string().valid('income', 'expense').required()
});

module.exports = {
    recordSchema
}