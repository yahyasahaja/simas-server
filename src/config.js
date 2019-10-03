export const LOG_MODE = 'dev'

const test = process.env.NODE_ENV === 'development'
console.log(process.env.NODE_ENV)
let database
if (test) {
  database = {
    DATABASE_NAME: 'sansapp',
    USER: 'root',
    PASSWORD: 'yahya123',
    HOST: 'localhost',
    DIALECT: 'mysql',
    PORT: 3306,
    POOL_SIZE: 10,
  }
} else database = {
  DATABASE_NAME: 'sansapp',
  USER: 'root',
  PASSWORD: 'sansaja123',
  HOST: 'localhost',
  DIALECT: 'mysql',
  PORT: 3306,
  POOL_SIZE: 10,
}
export const DATABASE = database

export const JWT = {
  SECRET_KEY: 'iwiguhieuwghewgSansAppSansAja3528352'
}

export const USER_TYPE = {
  CUSTOMER: 'Customer',
  RESTAURANT: 'Resto',
  GUEST: 'Guest'
}

export const CUSTOMER_SCOPE = [
  'allOrders',
  'order',
  'createOrder',
  'addOrderItemsToOrder',
  'replaceOrderItemsToOrder',
  'updateOrderItemInOrder',
  'removeOrderItemsFromOrder',
  'allCategories',
  'allRestaurantMenus',
  'allRestaurants',
  'customer',
  'customerLogin',
  'customerRegister',
  'updateCustomer',
  'restaurant',
  'recomendedRestaurant',
  'nearbyRestaurant',
  'allFavoriteMenus',
  'favoriteMenu',
  'unfavoriteMenu',
  'calculateTotalPrice',
]

export const RESTAURANT_SCOPE = [
  'allOrders',
  'order',
  'createOrder',
  'addOrderItemsToOrder',
  'replaceOrderItemsToOrder',
  'removeOrderItemsFromOrder',
  'allCategories',
  'allRestaurantMenus',
  'allRestaurants',
  'customer',
  'restaurantAdminLogin',
  'restaurantAdminRegister',
  'markOrderAsPaid',
  'payOrder',
]

export const ENDPOINT = `https://${test ? 'dev.' : ''}api.sans.ngopi.men`

export default {
  LOG_MODE,
  DATABASE,
  JWT,
  USER_TYPE,
  ENDPOINT,
}