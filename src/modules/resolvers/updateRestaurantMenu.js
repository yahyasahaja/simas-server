import db from '../../models'

export default async (obj, { id, input }, { scope }) => {
  if (!scope.includes('updateRestaurantMenu')) 
    throw new Error('Permission Denied')

  try {
    let restaurantMenu = await db.models.RestaurantMenu.findById(id)
    for (let key in input) if (input[key]) restaurantMenu[key] = input[key]

    return await restaurantMenu.save()
  } catch (error) {
    throw error
  }
}
