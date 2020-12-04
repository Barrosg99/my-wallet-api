const sessionsRepositories = require("../repositories/sessionsRepositories");
const usersRepositories = require("../repositories/usersRepositories");

async function authMiddleware(req, res, next) {
    if(!req.header('Authorization')) return res.sendStatus(401);

    const token = req.header('Authorization').split(' ')[1];

    try {
        const session = await sessionsRepositories.findByToken(token);
        if(!session) return res.status(401).send({ error: 'Invalid token' });
        
        const user = await usersRepositories.findUserById(session.userId);
        
        if(!user) return res.sendStatus(500);

        req.user = user;
        next();
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

module.exports = authMiddleware;