import connection from './connection'
import { events, DB_CONNECTED } from '../events'

// import User from './User')
import Customer from './Customer'
import Category from './Category'
import OrderItem from './OrderItem'
import Order from './Order'
import RestaurantMenu from './RestaurantMenu'
import RestaurantAdmin from './RestaurantAdmin'
import Restaurant from './Restaurant'
import SocialMedia from './SocialMedia'
import Payment from './Payment'
import './MenuCategory'
import './Favorite'
import './Upload'

// associate Restaurant with RestaurantMenu
Restaurant.hasMany(RestaurantMenu, { foreignKey: 'restaurant_id' })
RestaurantMenu.belongsTo(Restaurant, { foreignKey: 'restaurant_id' })

// associate RestaurantAdmin with Restaurant
RestaurantAdmin.belongsTo(Restaurant, { foreignKey: 'restaurant_id' })
Restaurant.hasOne(RestaurantAdmin, { foreignKey: 'restaurant_id' })

// associate Restaurant with Payment
Payment.hasOne(Restaurant, { foreignKey: 'payment_id' })
Restaurant.belongsTo(Payment, { foreignKey: 'payment_id' })

// associate Customer with Payment
Payment.hasOne(Customer, { foreignKey: 'payment_id' })
Customer.belongsTo(Payment, { foreignKey: 'payment_id' })

// associate SocialMedia with Restaurant
SocialMedia.hasOne(Restaurant, { foreignKey: 'soscial_media_id' })
Restaurant.belongsTo(SocialMedia, { foreignKey: 'social_media_id' })

// associate RestaurantMenu with Category
RestaurantMenu.belongsToMany(Category, {
  through: 'MenuCategory',
  foreignKey: 'menu_id',
  as: 'Categories'
})
Category.belongsToMany(RestaurantMenu, {
  through: 'MenuCategory',
  foreignKey: 'category_id'
})

// associate RestaurantMenu with Customer as Favorite Menu
RestaurantMenu.belongsToMany(Customer, {
  through: 'Favorite',
  foreignKey: 'menu_id',
  as: 'Favorites',
})
Customer.belongsToMany(RestaurantMenu, {
  through: 'Favorite',
  foreignKey: 'customer_id',
  as: 'Favorites',
})

// associate OrderItem with RestaurantMenu
RestaurantMenu.hasMany(OrderItem, { foreignKey: 'menu_id' })
OrderItem.belongsTo(RestaurantMenu, {
  foreignKey: 'menu_id',
  as: 'RestaurantMenus'
})

// associate Order with Restaurant, Customer, OrderItem
Order.belongsTo(Restaurant, { foreignKey: 'restaurant_id' })
Restaurant.hasMany(Order, { foreignKey: 'restaurant_id' })
Order.belongsTo(Customer, { foreignKey: 'customer_id' })
Customer.hasMany(Order, { foreignKey: 'customer_id' })
Order.hasMany(OrderItem, { foreignKey: 'order_id' })
OrderItem.belongsTo(Order, { foreignKey: 'order_id' })

import { giveSeeds } from '../seeders'

let force = false

connection
  .sync({
    force
  })
  .then(async () => {
    console.log('database synchronized')

    events.emit(DB_CONNECTED)
    if (force) giveSeeds()
  })
  .catch(err => {
    console.log(err)
  })
  
export default connection
