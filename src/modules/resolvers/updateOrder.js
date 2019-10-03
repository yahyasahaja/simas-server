import db from '../../models'
import moment from 'moment'

export default async (obj, { 
  input
}, { scope }) => {
  if (!scope.includes('updateOrder')) {
    throw new Error('Permission Denied')
  }

  try {
    const order = await db.models.Order.findById(input.id)
    
    for (let key in input) {
      if (input[key]) order[key] = input[key]
    }

    order.end_process_date = moment(Date.now()).add(3, 'hours').unix()

    await order.save()

    return order
  } catch (error) {
    throw error
  }
}