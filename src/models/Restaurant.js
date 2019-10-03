import Sequelize from 'sequelize'
import connection from './connection'

export default connection.define(
  'Restaurant',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    opening_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    closing_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    is_24_hours: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: false
    },
    picture: {
      type: Sequelize.STRING,
      allowNull: false
    },
    total_tables: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    address: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    lat: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    long: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  },
  {
    underscored: true,
    timestamps: false
  }
)
