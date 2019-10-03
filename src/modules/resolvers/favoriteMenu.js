import db from '../../models'

export default async (obj, { 
  menu_id
}, { scope, user }) => {
  if (!scope.includes('favoriteMenu')) {
    throw new Error('Permission Denied')
  }

  try {
    await user.addFavorite(menu_id)
    return 'OK'
  } catch (error) {
    throw error
  }
}