const RecordRepository = require("./recordsRepositories");
const SessionRepository = require("./sessionsRepositories");
const UserRepository = require("./usersRepositories");

class RepositoryFactory {
  static createRepository(type) {
    switch (type) {
      case "session":
        return new SessionRepository();
      case "user":
        return new UserRepository();
      case "record":
        return new RecordRepository();
      default:
        throw new Error(`Unknown service type: ${type}`);
    }
  }
}

module.exports = RepositoryFactory;
