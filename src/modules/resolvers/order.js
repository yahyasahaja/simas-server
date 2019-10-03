import db from '../../models'

export default async (obj, { id }, { user }) => {
  // if (context.scope.includes('order')) 
  //   throw new Error('Permission Denied')

  try {
    let order = await db.models.Order.findByPk(id)

    if (order.customer_id === user.id) return order
    else throw new Error('Permission Denied')
  } catch (error) {
    throw error
  }
}
