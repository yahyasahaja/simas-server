import db from '../../models'

// for restaurant admin only
export default async (obj, { order_id }, { scope }) => {
  if (!scope.includes('payOrder')) {
    throw new Error('Permission Denied')
  }

  try {
    const order = await db.models.Order.findById(order_id)

    if (order === null) {
      throw new Error('Invalid Order ID')
    }
    
    order.status = 'PROCESS'
    await order.save()

    return order 
  } catch (error) {
    throw error
  }
}
