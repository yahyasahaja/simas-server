import { makeExecutableSchema } from 'graphql-tools'
import gql from 'graphql-tag'

import resolvers from './resolvers'

const typeDefs = gql`
  scalar Upload

  enum OrderStatus {
    UNPAID
    PROCESS
    COMPLETE
  }

  enum PaymentMethod {
    OVO
    DEBIT
    CASH
  }

  type Payment {
    id: ID
    name: String
    balance: Int
  }

  type RestaurantMenu {
    id: ID!
    name: String!
    description: String
    price: Int!
    image: String!
    categories: [Category!]!
    liked: Boolean!
  }

  type Restaurant {
    id: ID!
    name: String!
    description: String!
    opening_time: String!
    closing_time: String!
    is_24_hours: String!
    phone_number: String!
    total_tables: String!
    address: String!
    lat: String,
    long: String,
    menus: [RestaurantMenu!]!
    picture: String
    slug: String!
    categories: [Category]
    rating: Float
  }

  type RestaurantAdmin {
    id: ID!
    email: String!
    restaurant: Restaurant!
    nin: String!
    address: String!
    phone_number: String!
  }

  type Customer {
    id: ID!
    uid: String
    email: String!
    name: String!
    profile_picture: String
    payment: Payment
  }

  type OrderItem {
    id: ID!
    restaurant_menu: RestaurantMenu!
    quantity: Int!
    note: String
  }

  type Order {
    id: ID!
    menu_price: Int!
    tax: Int!
    discount: Int!
    other_price: Int!
    total_price: Int!
    table_number: Int
    restaurant: Restaurant!
    customer: Customer!
    order_items: [OrderItem!]!
    order_number: String!
    status: OrderStatus,
    created_at: String!
    payment_method: PaymentMethod,
  }

  type Category {
    id: ID!
    name: String!
    menus: [RestaurantMenu!]!
  }

  type Price {
    tax: Float
    discount: Float
    menu_price: Float
    other_price: Float
    total_price: Float
  }

  input OrderItemInput {
    menu_id: ID!
    quantity: Int!
    note: String!
  }

  input OrderInput {
    id: ID!
    table_number: Int!
  }

  input UpdateCustomerInput {
    email: String
    name: String
  }

  input UpdateRestaurantInput {
    name: String
    description: String
    opening_time: String
    closing_time: String
    is_24_hours: String
    phone_number: String
    total_tables: String
    address: String
    picture: String
    slug: String
  }

  input UpdateOrderInput {
    id: ID!,
    total_price: Float,
    menu_price: Float,
    tax: Float,
    discount: Float,
    other_price: Float,
    status: OrderStatus,
    table_number: Int
  }

  input RestaurantMenuInput {
    name: String
    description: String
    price: Int
    image: String
    categorie_ids: [ID]
  }

  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    "get recomended restaurants"
    recomendedRestaurants(lat: String!, long: String!): [Restaurant!]!

    "get nearby restaurants"
    nearbyRestaurants(lat: String!, long: String!): [Restaurant!]!

    "get all restaurants"
    allRestaurants: [Restaurant!]!

    "get restaurant by id or using restaurant admin token"
    restaurant(id: ID, slug: String): Restaurant

    "get restaurant admin by id or using restaurant admin token"
    restaurantAdmin(id: ID): RestaurantAdmin

    "get all restaurant menu from a restaurant"
    allRestaurantMenus(restaurant_id: ID): [RestaurantMenu!]!

    "get single restaurant menu from a restaurant"
    restaurantMenu(id: ID!): RestaurantMenu

    "get all orders"
    allOrders(status: OrderStatus): [Order!]!

    "get detailed order"
    order(id: ID!): Order

    "get customer by id or using customer token"
    customer(id: ID): Customer!

    "get all categories by restaurant id"
    allCategories(restaurant_id: ID): [Category!]!

    "get customer favorite menus"
    allFavoriteMenus: [RestaurantMenu]

    #UPLOADS
    uploads: [File]
  }

  "mutation"
  type Mutation {
    #CUSTOMER
    "customer login and get user token"
    customerLogin(idToken: String!): String!
    
    "favorite a menu"
    favoriteMenu(menu_id: ID): String!
    
    "unfavorite a menu"
    unfavoriteMenu(menu_id: ID): String!

    "update customer profile"
    updateCustomer(input: UpdateCustomerInput!): String!

    #RESTAURANT ADMIN
    "restaurant admin login, and get user token"
    restaurantAdminLogin(email: String!, password: String!): String!

    "update Restaurant Admin"
    updateRestaurantAdmin(input: UpdateCustomerInput!): RestaurantAdmin

    #RESTAURANT
    updateRestaurant(input: UpdateRestaurantInput!): Restaurant

    #"verify email verification token"
    #verifyRestaurant(token: String!): Restaurant

    #TRANSACTION

    "create a new order"
    createOrder(
      restaurant_id: ID!, 
      order_items: [OrderItemInput!]!, 
      payment_method: PaymentMethod!,
      customer_id: ID!,
      table_number: Int!,
    ): Order

    "remove an order"
    removeOrder(restaurant_id: ID!): String

    "update an order"
    updateOrder(
      input: UpdateOrderInput!
    ): Order

    "remove order item to order (for restaurant admin)"
    removeOrderItemsFromOrder(order_item_ids: [ID!]!): Order

    "update order item to order (for restaurant admin)"
    replaceOrderItemsInOrder(order_items: [OrderItemInput!]!): Order

    "pay order using cash"
    payOrder(order_id: ID!): Order

    "calculate total price before ordering"
    calculateTotalPrice(order_items: [OrderItemInput!]!): Price

    "add restaurant menu"
    addRestaurantMenu(input: [RestaurantMenuInput!]!): RestaurantMenu

    "update restaurant menu"
    updateRestaurantMenu(id: ID!, input: [RestaurantMenuInput!]!): RestaurantMenu

    "remove restaurant menu"
    removeRestaurantMenu(id: ID): String

    #UPLOADS
    singleUpload(file: Upload!): File!
    multipleUpload(files: [Upload!]!): [File!]!
  }
`

export default makeExecutableSchema({ typeDefs, resolvers })
