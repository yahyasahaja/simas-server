import db from '../../models'

export default async (obj, { restaurant_id: id }, context) => {
  try {
    let restaurant_id = id || context.user.id
    
    return await db.models.RestaurantMenu.findAll({
      where: { restaurant_id }
    })
  } catch (error) {
    throw error
  }
}
