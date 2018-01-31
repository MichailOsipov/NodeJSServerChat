const Guid = require('guid');

module.exports.generateUniqueId = () => (Guid.create()).value;
