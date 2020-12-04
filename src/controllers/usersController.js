const userSchemas = require('../schemas/usersSchemas');
const usersRepositories = require('../repositories/usersRepositories');
const sessionsRepositories = require('../repositories/sessionsRepositories');


async function postSignUp(req, res) {
    const user = req.body;

    const { error } = userSchemas.signUp.validate(user);
    if (error) return res.status(422).send({ errors: error.details[0].message });


    try {
        if(await usersRepositories.findUserByEmail(user.email)) return res.status(409).send({ errors: 'Email already in use'});

        const insertedUser = await usersRepositories.createUser(user);
        res.status(201).send(getUser(insertedUser));
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }   
}

async function postSignIn(req, res) {
    const userInfo = req.body;
    const bcrypt = require('bcrypt');

    const { error } = userSchemas.signIn.validate(userInfo);
    if (error) return res.status(422).send({ errors: error.details[0].message });

    try {
        const user = await usersRepositories.findUserByEmail(userInfo.email);
        if (!user) return res.status(401).send({ error: "Wrong email or password" });

        const checkPassword = bcrypt.compareSync( userInfo.password, user.password);
        if(!checkPassword) return res.status(401).send({ error: "Wrong email or password" });

        const { token } = await sessionsRepositories.createByUserId(user.id);
        const userData = getUser(user);
        res.send({ ...userData, token });

    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

async function postSignOut(req, res) {
    try {
        const userId = req.user.id
        await sessionsRepositories.destroyByUserId(userId);
        res.sendStatus(200)
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

function getUser(userData) {

    const { id, name, email } = userData;
    return {
        id,
        name,
        email
    }
}

module.exports = {
    postSignUp,
    postSignIn,
    postSignOut
}