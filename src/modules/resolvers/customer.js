import db from '../../models'

export default async (obj, { id }, context) => {
  if (context.scope.includes('customer')) {
    try {
      if (!id) {
        id = context.user.id
        if (context.userType !== 'Customer') throw new Error('Permission Denied')
      }

      return await db.models.Customer.findById(id)
    } catch (error) {
      throw error
    }
  } else {
    throw new Error('Permission Denied')
  }
}
