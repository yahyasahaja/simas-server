import bcrypt from 'bcrypt'
import db from '../../models'
import jwt from 'jsonwebtoken'
import { JWT, USER_TYPE, CUSTOMER_SCOPE } from '../../config'
import { sendEmailVerification } from '../../utils'

export default async (obj, { email, password, name }) => {
  try {
    const duplicatedUser = await db.models.Customer.findOne({
      where: {
        email
      }
    })

    if (duplicatedUser) throw new Error('User with same email already exist')

    const user = await db.models.Customer.create({
      email,
      name,
      password: await bcrypt.hash(password, 12)
    })

    let token = jwt.sign(
      {
        scope: CUSTOMER_SCOPE,
        userId: user.id,
        userType: USER_TYPE.CUSTOMER
      },
      JWT.SECRET_KEY
    )

    await sendEmailVerification(user, USER_TYPE.CUSTOMER)

    return token
  } catch (err) {
    return err
  }
}
