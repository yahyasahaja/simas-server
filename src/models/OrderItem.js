import Sequelize from 'sequelize'
import connection from './connection'

export default connection.define(
  'OrderItem',
  {
    note: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    quantity: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
  },
  {
    underscored: true,
    timestamps: false
  }
)
