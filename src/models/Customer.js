import Sequelize from 'sequelize'
import connection from './connection'

export default connection.define(
  'Customer',
  {
    email: {
      type: Sequelize.STRING(128),
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    profile_picture: {
      type: Sequelize.STRING(128),
      allowNull: true
    },
    uid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    timestamps: false
  }
)
