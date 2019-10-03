import db from '../../models'

export default async (obj, { id }, context) => {
  if (context.scope.includes('restaurantMenu')) {
    try {
      return await db.models.RestaurantMenu.findById(id)
    } catch (error) {
      throw error
    }
  } else {
    throw new Error('Permission Denied')
  }
}
