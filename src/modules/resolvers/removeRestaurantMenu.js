import db from '../../models'

export default async (obj, { id }, { scope }) => {
  if (!scope.includes('updateRestaurantMenu')) 
    throw new Error('Permission Denied')

  try {
    await db.models.RestaurantMenu.destroy({where: {id}})
    return 'OK'
  } catch (error) {
    throw error
  }
}
