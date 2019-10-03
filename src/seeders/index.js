//MODULES
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Sequelize from 'sequelize'

//CONFIG
import { JWT, USER_TYPE, CUSTOMER_SCOPE } from '../config'

//DATABASE
// import db from '../db'

//MODELS
import db from '../models/connection'

const {
  Restaurant,
  RestaurantMenu,
  // Order,
  Category,
  MenuCategory,
  Customer,
  Favorite,
  Payment,
} = db.models

//SEEDS
import restaurants from './restaurants.js'
import restaurant_menu from './restaurant_menu.js'
import categories from './categories.js'
import menu_categories from './menu_categories.js'
import customers from './customers.js'
import payments from './payments.js'

import { findNearbyRestaurants } from '../utils'

function getAttr(instance) {
  for (let i in instance) 
    if (i.indexOf('get') !== -1 || 
        i.indexOf('set') !== -1 || 
        i.indexOf('remove') !== -1 ||
        i.indexOf('add') !== -1) 
      console.log(i)
}

//SEEDERS
export const giveSeeds = async () => {
  let loc
  
  //DESTROY CONSTAINTS
  await Favorite.destroy({where: {}, force: true})
  await Payment.destroy({where: {}, force: true})

  //ADD PAYMENT FEEDS
  await Payment.bulkCreate(payments)

  //ADD CUSTOMER SEEDS
  await Customer.destroy({where: {}, force: true})
  let customersRes = await Customer.bulkCreate(customers)
  console.log('\nfunctions in customer')
  getAttr(customersRes[0])
  
  //ADD RESTAURANT SEEDS
  await Restaurant.destroy({ where: {}, force: true })
  for (let restaurant of restaurants)
    restaurant.password = await bcrypt.hash(restaurant.password, 12)
  let restaurantsRes = await Restaurant.bulkCreate(restaurants)
 
  await Category.destroy({ where: {}, force: true })
  await Category.bulkCreate(categories)

  await RestaurantMenu.destroy({ where: {}, force: true })
  let restaurantMenusRes = await RestaurantMenu.bulkCreate(restaurant_menu)

  console.log('\nfunctions in restaurant menu')
  getAttr(restaurantMenusRes[0])
  await customersRes[0].addFavorite(16)

  await MenuCategory.destroy({ where: {}, force: true })
  await MenuCategory.bulkCreate(menu_categories)

  let res = await findNearbyRestaurants({lat: '-7.939237', long: '112.631553'})
  console.log(res.map(d => d.distance))

  console.log(jwt.sign(
    {
      scope: CUSTOMER_SCOPE,
      userId: customersRes[0].id,
      userType: USER_TYPE.CUSTOMER,
      uid: customersRes[0].uid,
    },
    JWT.SECRET_KEY
  ))
}

export default {
  giveSeeds,
}