const { MongoMemoryServer } = require('mongodb-memory-server');

class MemoryDatabaseServer {
  constructor() {
    this.mongod = new MongoMemoryServer({
      binary: {
        version: '5.0.7',
      },
      autoStart: false,
    });
  }

  start() {
    return this.mongod.start();
  }

  stop() {
    return this.mongod.stop();
  }

  getConnectionString() {
    return this.mongod.getConnectionString;
  }
}

module.exports = new MemoryDatabaseServer();