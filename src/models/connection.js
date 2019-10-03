import { DATABASE } from '../config'
import Sequelize from 'sequelize'

const { 
  DATABASE_NAME,
  DIALECT: dialect,
  HOST: host,
  PASSWORD,
  POOL_SIZE: max,
  PORT: port,
  USER,
} = DATABASE

const connection = new Sequelize(DATABASE_NAME, USER, PASSWORD, {
  dialect,
  host,
  port,
  logging: false,
  pool: {
    min: 1,
    max,
    acquire: 30000,
    idle: 1000
  },
  operatorsAliases: false
})

export default connection
