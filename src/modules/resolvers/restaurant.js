import db from '../../models'

export default async (obj, { id, slug }, context) => {
  try {
    if (!id && !slug) {
      // console.log(id)
      id = context.user.id
      if (context.userType !== 'Resto') throw new Error('Permission Denied')
    }

    if (id) return await db.models.Restaurant.findByPk(id)
    else return db.models.Restaurant.findOne({where: { slug }})
  } catch (error) {
    throw error
  }
}
