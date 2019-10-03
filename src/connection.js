//MODULES
import Sequelize, { Op } from 'sequelize'

//DATABASE_CONFIGURATION
import { DATABASE } from './config'

//CONNECTION
export const connection = new Sequelize(
  DATABASE.DATABASE_NAME, 
  DATABASE.USER, 
  DATABASE.PASSWORD, 
  {
    host: DATABASE.HOST,
    dialect: DATABASE.DIALECT,
    port: DATABASE.PORT,
    pool: {
      max: DATABASE.POOL_SIZE,
      min: 0,
      acquire: 30000,
      idle: 1000,
    },
    logging: false,
    operatorsAliases: {
      $eq: Op.eq,
      $ne: Op.ne,
      $gte: Op.gte,
      $gt: Op.gt,
      $lte: Op.lte,
      $lt: Op.lt,
      $not: Op.not,
      $in: Op.in,
      $notIn: Op.notIn,
      $is: Op.is,
      $like: Op.like,
      $notLike: Op.notLike,
      $iLike: Op.iLike,
      $notILike: Op.notILike,
      $regexp: Op.regexp,
      $notRegexp: Op.notRegexp,
      $iRegexp: Op.iRegexp,
      $notIRegexp: Op.notIRegexp,
      $between: Op.between,
      $notBetween: Op.notBetween,
      $overlap: Op.overlap,
      $contains: Op.contains,
      $contained: Op.contained,
      $adjacent: Op.adjacent,
      $strictLeft: Op.strictLeft,
      $strictRight: Op.strictRight,
      $noExtendRight: Op.noExtendRight,
      $noExtendLeft: Op.noExtendLeft,
      $and: Op.and,
      $or: Op.or,
      $any: Op.any,
      $all: Op.all,
      $values: Op.values,
      $col: Op.col
    },
  }
)

export default connection