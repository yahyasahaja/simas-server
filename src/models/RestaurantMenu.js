import Sequelize from 'sequelize'
import connection from './connection'

export default connection.define(
  'RestaurantMenu',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    }
  },
  {
    underscored: true,
    timestamps: false
  }
)
