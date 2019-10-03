import db from '../../models'
import { JWT, USER_TYPE } from '../../config'
import jwt from 'jsonwebtoken'

export default async (obj, { token, order_item_ids }, { scope, userType }) => {
  if (token && userType === USER_TYPE.GUEST) scope = jwt.verify(token, JWT.SECRET_KEY).scope
  
  if (!scope.includes('removeOrderItemsFromOrder')) {
    throw new Error('Permission Denied')
  }

  try {
    const order = await db.models.Order.findById({where: { token }})
    
    if (order === null) {
      throw new Error('Invalid Order ID')
    }

    return await db.models.OrderItem.destroy({
      where: { id: order_item_ids }
    })
  } catch (error) {
    throw error
  }
}
