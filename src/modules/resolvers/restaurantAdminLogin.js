import { JWT, USER_TYPE, RESTAURANT_SCOPE } from '../../config'
import jwt from 'jsonwebtoken'
import db from '../../models'
import * as admin from 'firebase-admin'

export default async (obj, { idToken }) => {
  try {
    //get user uid
    let decodedToken = await admin.auth().verifyIdToken(idToken)
    let { name, uid, email } = decodedToken

    if (!decodedToken) {
      throw new Error('Invalid token')
    }

    console.log('decoded token', decodedToken)
    //get user with decoded token's uid
    let restaurant = await db.models.RestaurantAdmin.findOne({ where: {uid}})

    //check if there's no user found, create it
    console.log('restaurant', restaurant, uid, name, email)
    if (!restaurant) {
      restaurant = await db.models.Customer.create({
        uid, email, name
      })
    }

    return jwt.sign(
      {
        scope: RESTAURANT_SCOPE,
        userId: restaurant.id,
        userType: USER_TYPE.RESTAURANT,
        uid,
      },
      JWT.SECRET_KEY
    )
  } catch (err) {
    throw err
  }
}
