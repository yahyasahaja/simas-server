import db from '../../models'

export default async (obj, { 
  menu_id
}, { scope, user }) => {
  if (!scope.includes('allFavoriteMenus')) {
    throw new Error('Permission Denied')
  }

  try {
    return await user.getFavorites()
  } catch (error) {
    throw error
  }
}