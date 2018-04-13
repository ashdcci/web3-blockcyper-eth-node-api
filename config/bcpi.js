bcypher = require('blockcypher');
var bcapi = new bcypher('bcy',process.env.BNP_CYPHER_ENV,process.env.BNP_CYPHER_API_TOKEN);
module.exports = bcapi
