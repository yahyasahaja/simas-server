import db from '../../models'

export default async (/* obj, { location } */) => {
  try {
    return await db.models.Restaurant.findAll()
  } catch (error) {
    throw error
  }
}
