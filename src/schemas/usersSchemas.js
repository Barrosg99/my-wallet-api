const Joi = require('joi');

const signUp = Joi.object({
    name: Joi.string().pattern(/^[A-Za-z ]+$/).min(5).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
    passwordConfirmation: Joi.string().valid(Joi.ref('password')).required()
})

const signIn = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required()
})

module.exports = {
    signUp,
    signIn
}