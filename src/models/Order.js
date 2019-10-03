import Sequelize from 'sequelize'
import connection from './connection'

export default connection.define(
  'Order',
  {
    total_price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    menu_price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    tax: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    discount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    other_price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    payment_method: {
      type: Sequelize.ENUM([
        'OVO',
        'DEBIT',
        'CASH',
      ]),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM([
        'UNPAID',
        'PROCESS',
        'COMPLETE'
      ]),
      allowNull: false,
      defaultValue: 'UNPAID'
    },
    table_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    order_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    end_process_date: {
      type: Sequelize.INTEGER,
    }
  },
  {
    underscored: true,
    timestamps: true
  }
)
