import { JWT, USER_TYPE, RESTAURANT_SCOPE } from '../../config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from '../../models'
import { sendEmailVerification } from '../../utils'

export default async (obj, { email, password }) => {
  try {
    const restoAdmin = await db.models.RestaurantAdmin.findOne({
      where: { email }
    })

    if (restoAdmin === null) {
      throw new Error('No user matches with that email')
    }

    if (!await bcrypt.compare(password, restoAdmin.password)) {
      throw new Error('Invalid Email or Password')
    }

    await sendEmailVerification(restoAdmin, USER_TYPE.RESTAURANT)
    
    return jwt.sign(
      {
        scope: RESTAURANT_SCOPE,
        userId: restoAdmin.id,
        userType: USER_TYPE.RESTAURANT
      },
      JWT.SECRET_KEY
    )
  } catch (err) {
    return err
  }
}
