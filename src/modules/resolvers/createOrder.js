import db from '../../models'
import moment from 'moment'
import shortid from 'shortid'

export default async (obj, { 
  restaurant_id, 
  order_items, 
  customer_id,
  payment_method,
  table_number,
}, { scope, user }) => {
  if (!scope.includes('replaceOrderItemsToOrder')) {
    throw new Error('Permission Denied')
  }

  try {
    let tax = 0
    let discount = 0
    let menu_price = 0
    let other_price = 0
    let status = payment_method === 'CASH' ? 'UNPAID' : 'PROCESS'

    for (let orderItem of order_items) {
      menu_price += 
        (await db.models.RestaurantMenu.findById(orderItem.menu_id)).price * orderItem.quantity
    }

    customer_id = customer_id || user.id

    let total_price = menu_price + tax + other_price - discount
    let end_process_date = moment(Date.now()).add(1, 'minutes').unix()

    let order = {
      restaurant_id,
      customer_id,
      tax,
      discount,
      menu_price,
      total_price,
      other_price,
      payment_method,
      status,
      table_number,
      end_process_date,
      order_number: shortid.generate(),
    }

    // if (userType === USER_TYPE.CUSTOMER) order.customer_id = user.id

    if (payment_method === 'OVO') {
      let payment = await user.getPayment()
      payment.balance -= total_price
      if (payment.balance < 0) throw new Error(`${payment.name} balance not enough!`)
      await payment.save()
    }

    order = await db.models.Order.create(order)
    await db.models.OrderItem.bulkCreate(
      order_items.map(d => ({ order_id: order.id, ...d}))
    )

    return order
  } catch (error) {
    throw error
  }
}