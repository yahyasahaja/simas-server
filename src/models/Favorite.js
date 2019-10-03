//MODULES
// import Sequelize from 'sequelize')
import connection from './connection'

//USER_SCHEMA
export default connection.define(
  'Favorite',
  {},
  {
    underscored: true,
    timestamps: false
  }
)
