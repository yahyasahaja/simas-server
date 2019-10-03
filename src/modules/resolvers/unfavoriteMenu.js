import db from '../../models'

export default async (obj, { 
  menu_id
}, { scope, user }) => {
  if (!scope.includes('unfavoriteMenu')) {
    throw new Error('Permission Denied')
  }

  try {
    await user.removeFavorite(menu_id)
    return 'OK'
  } catch (error) {
    throw error
  }
}