const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.ORACLE_CONNECTION, process.env.ORACLE_USERNAME, process.env.ORACLE_PASS, {
    host: process.env.ORACLE_IP,
    port: process.env.ORACLE_PORT,
    dialect: 'oracle'
  });


module.exports = sequelize;