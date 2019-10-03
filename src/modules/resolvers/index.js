import { GraphQLUpload } from 'apollo-upload-server'
import Sequelize from 'sequelize'

//MODELS
import db from '../../models'

import allRestaurants from './allRestaurants'
import restaurant from './restaurant'
import allRestaurantMenus from './allRestaurantMenus'
import restaurantMenu from './restaurantMenu'
import allOrders from './allOrders'
import order from './order'
import allCategories from './allCategories'
import customer from './customer'
import nearbyRestaurants from './nearbyRestaurants'
import recomendedRestaurants from './recomendedRestaurants'
import allFavoriteMenus from './allFavoriteMenus'

import customerLogin from './customerLogin'
import restaurantAdminLogin from './restaurantAdminLogin'
import removeOrderItemsFromOrder from './removeOrderItemsFromOrder'
import replaceOrderItemsInOrder from './replaceOrderItemsInOrder'
import updateOrder from './updateOrder'
import updateCustomer from './updateCustomer'
import updateRestaurant from './updateRestaurant'
import updateRestaurantAdmin from './updateRestaurantAdmin'
import payOrder from './payOrder'
import calculateTotalPrice from './calculateTotalPrice'
import addRestaurantMenu from './addRestaurantMenu'
import updateRestaurantMenu from './updateRestaurantMenu'
import removeRestaurantMenu from './removeRestaurantMenu'
import favoriteMenu from './favoriteMenu'
import unfavoriteMenu from './unfavoriteMenu'
import createOrder from './createOrder'
import { ENDPOINT } from '../../config'

export default {
  Upload: GraphQLUpload,
  RestaurantAdmin: {
    restaurant: async restaurantAdmin => {
      return await restaurantAdmin.getRestaurant()
    }
  },
  Customer: {
    payment: async customer => {
      return await customer.getPayment()
    }
  },
  Restaurant: {
    picture: restaurant => `${ENDPOINT}${restaurant.picture}`,
    menus: async restaurant => {
      // for (let i in restaurant) if (i.indexOf('get') != -1) console.log(i)
      return await restaurant.getRestaurantMenus()
    },
    categories: async restaurant => {
      let res = (await db.query(
        `
        select d.id, d.name
        from Restaurants a join RestaurantMenus b
        on a.id = b.restaurant_id
        join MenuCategories c
        on b.id = c.menu_id
        join Categories d
        on c.category_id = d.id
        where a.id = ${restaurant.id}
        group by d.id
      `,
        {
          type: Sequelize.QueryTypes.SELECT,
          model: db.models.Category,
          mapToModel: true,
        }
      ))

      return res
    }
  },
  RestaurantMenu: {
    image: restaurant => `${ENDPOINT}${restaurant.image}`,
    liked: async (restaurantMenu, _, { user }) => {
      if (user) {
        let favs = await user.getFavorites({where: {id: restaurantMenu.id}})
        console.log(favs.length)
        return favs.length > 0
      }
      return false
    },
    categories: async restaurantMenu => {
      return await restaurantMenu.getCategories()
    }
  },
  Order: {
    restaurant: async order => {
      return await order.getRestaurant()
    },
    customer: async order => {
      let customer = await order.getCustomer()
      if (customer) return customer

      return {
        id: 0,
        name: 'Guest',
        email: ''
      }
    },
    order_items: async order => {
      return await order.getOrderItems()
    }
  },
  OrderItem: {
    restaurant_menu: async orderItem => {
      return await orderItem.getRestaurantMenus()
    }
  },
  Category: {
    menus: async category => {
      let res = (await db.query(
        `
        select RestaurantMenus.*
        from RestaurantMenus join MenuCategories
        on RestaurantMenus.id = MenuCategories.menu_id
        join Categories
        on Categories.id = MenuCategories.category_id
        where Categories.id = ${category.id}
      `,
        {
          type: Sequelize.QueryTypes.SELECT,
          model: db.models.RestaurantMenu,
          mapToModel: true,
        }
      ))

      return res
    }
  },
  Query: {
    allRestaurants,
    restaurant,
    allRestaurantMenus,
    restaurantMenu,
    allOrders,
    order,
    allCategories,
    customer,
    uploads: () => db.models.Upload.findAll(),
    nearbyRestaurants,
    recomendedRestaurants,
    allFavoriteMenus,
  },
  Mutation: {
    customerLogin,
    restaurantAdminLogin,
    removeOrderItemsFromOrder,
    replaceOrderItemsInOrder,
    updateOrder,
    updateCustomer,
    updateRestaurantAdmin,
    updateRestaurant,
    calculateTotalPrice,
    payOrder,
    addRestaurantMenu,
    updateRestaurantMenu,
    removeRestaurantMenu,
    favoriteMenu,
    unfavoriteMenu,
    createOrder,
  }
}
