import db from '../../models'

export default async (obj, { 
  order_items, 
}, { scope }) => {
  if (!scope.includes('calculateTotalPrice')) {
    throw new Error('Permission Denied')
  }

  try {
    let tax = 0
    let discount = 0
    let menu_price = 0
    let other_price = 0
    let total_price = 0

    for (let orderItem of order_items) {
      menu_price += 
        (await db.models.RestaurantMenu.findById(orderItem.menu_id)).price * orderItem.quantity
    }

    total_price = menu_price + tax + other_price - discount

    return {
      tax,
      discount,
      menu_price,
      other_price,
      total_price,
    }
  } catch (error) {
    throw error
  }
}