const MemoryDatabaseServer = require('../../config/MemoryDatabaseServer');

module.exports = async () => {
  await MemoryDatabaseServer.start();
};