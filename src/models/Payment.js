import Sequelize from 'sequelize'
import connection from './connection'

export default connection.define(
  'Payment',
  {
    name: {
      type: Sequelize.ENUM(['OVO']),
      allowNull: false,
    },
    balance: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    underscored: true,
    timestamps: false
  }
)
