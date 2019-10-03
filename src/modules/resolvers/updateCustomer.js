// import db from '../../models'

export default async (obj, { input }, { scope, user }) => {
  if (scope.includes('updateCustomer')) {
    try {
      for (let key in input) if (input[key]) user[key] = input[key]

      return await user.save()
    } catch (error) {
      throw error
    }
  } else {
    throw new Error('Permission Denied')
  }
}
