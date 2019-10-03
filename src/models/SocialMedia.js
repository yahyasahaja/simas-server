import Sequelize from 'sequelize'
import connection from './connection'

export default connection.define(
  'SocialMedia',
  {
    facebook: {
      type: Sequelize.STRING,
    },
    twitter: {
      type: Sequelize.STRING,
    },
    instagram: {
      type: Sequelize.STRING,
    },
  },
  {
    underscored: true,
    timestamps: false
  }
)
