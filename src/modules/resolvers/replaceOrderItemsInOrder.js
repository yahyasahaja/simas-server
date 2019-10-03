import db from '../../models'
import moment from 'moment'
// import { JWT, USER_TYPE } from '../../config'
// import jwt from 'jsonwebtoken'

export default async (obj, { order_items }, { scope, order }) => {
  // if (token && userType === USER_TYPE.GUEST) scope = jwt.verify(token, JWT.SECRET_KEY).scope
  
  if (!scope.includes('replaceOrderItemsToOrder')) {
    throw new Error('Permission Denied')
  }

  try {
    order = await db.models.Order.findById({where: { id: order.id }})
    
    if (order === null) {
      throw new Error('Invalid Order ID')
    }

    await order.setOrderItems([])
    await db.models.OrderItem.destroy({where: {order_id: order.id}})
    await order.addOrderItems((await db.models.OrderItem.bulkCreate(order_items)).map(d => d.id))
    order.end_process_date = moment(Date.now()).add(3, 'hours').unix()
    await order.save()
    
    return order
  } catch (error) {
    throw error
  }
}
