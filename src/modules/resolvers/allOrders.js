import db from '../../models'
import { USER_TYPE } from '../../config'

export default async (obj, {status}, context) => {
  if (context.scope.includes('allOrders')) {
    try {
      // TODO:
      // 1. limit by scope (done)
      // 2. limit by context (if the user is customer, show all of
      //    his order logs) (done)
      const searchQuery = {}
      
      searchQuery [
        context.userType === USER_TYPE.RESTAURANT
          ? 'restaurant_id'
          : 'customer_id'
      ] = context.user.id
      if (status) searchQuery.status = status

      return await db.models.Order.findAll({where: searchQuery})
    } catch (error) {
      throw error
    }
  } else {
    throw new Error('Permission Denied')
  }
}
