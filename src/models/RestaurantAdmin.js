import Sequelize from 'sequelize'
import connection from './connection'

export default connection.define(
  'RestaurantAdmin',
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // password: {
    //   type: Sequelize.STRING,
    //   allowNull: false
    // },
    uid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // phone_number: {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // },
    // verification_token: {
    //   type: Sequelize.STRING,
    // },
    // is_verified: {
    //   type: Sequelize.BOOLEAN,
    //   defaultValue: false,
    // }
  },
  {
    underscored: true,
    timestamps: false
  }
)
