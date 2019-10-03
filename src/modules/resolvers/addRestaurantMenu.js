import db from '../../models'

export default async (obj, { input }, { scope, user }) => {
  if (!scope.includes('addRestaurantMenu')) 
    throw new Error('Permission Denied')

  try {
    return await db.models.RestaurantMenu.create({ ...input, restaurant_id: user.id })
  } catch (error) {
    throw error
  }
}
