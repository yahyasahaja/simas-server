import { JWT, USER_TYPE, CUSTOMER_SCOPE } from '../../config'
import jwt from 'jsonwebtoken'
import db from '../../models'
import * as admin from 'firebase-admin'

export default async (obj, { idToken }) => {
  try {
    //get user uid
    let decodedToken = await admin.auth().verifyIdToken(idToken)
    let { name, uid, email, picture: profile_picture } = decodedToken

    if (!decodedToken) {
      throw new Error('Invalid token')
    }

    console.log('decoded token', decodedToken)
    //get user with decoded token's uid
    let customer = await db.models.Customer.findOne({ where: {uid}})

    //check if there's no user found, create it
    console.log('customer', customer, uid, name, email)
    if (!customer) {
      let payment = await db.models.Payment.create({name: 'OVO', balance: 10000000})
      customer = await db.models.Customer.create({
        uid, email, name, payment_id: payment.id, profile_picture
      })
    }

    return jwt.sign(
      {
        scope: CUSTOMER_SCOPE,
        userId: customer.id,
        userType: USER_TYPE.CUSTOMER,
        uid,
      },
      JWT.SECRET_KEY
    )
  } catch (err) {
    throw err
  }
}
