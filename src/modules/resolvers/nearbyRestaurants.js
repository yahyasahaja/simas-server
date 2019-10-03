import db from '../../models'
import { findNearbyRestaurants } from '../../utils'

export default async (obj, { 
  lat,
  long
}, { scope, user }) => {
  // if (!scope.includes('nearbyRestaurant')) {
  //   throw new Error('Permission Denied')
  // }

  try {
    return await findNearbyRestaurants({lat, long})
  } catch (error) {
    throw error
  }
}