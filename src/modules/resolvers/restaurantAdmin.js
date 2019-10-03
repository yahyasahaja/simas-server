import db from '../../models'

export default async (obj, { id }, context) => {
  if (context.scope.includes('restaurantAdmin')) {
    try {
      if (!id) {
        id = context.user.id
        if (context.userType !== 'Resto') throw new Error('Permission Denied')
      }

      return await db.models.RestaurantAdmin.findById(id)
    } catch (error) {
      throw error
    }
  } else {
    throw new Error('Permission Denied')
  }
}
