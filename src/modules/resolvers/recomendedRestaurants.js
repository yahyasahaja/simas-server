import db from '../../models'
import { findNearbyRestaurants } from '../../utils'

const weightPrice = v => {
  return v < 8000 ? 1 : v < 12000 ? .8 : v < 20000 ? .6 : v < 35000 ? .4 : .2
}

const weightDistance = v => {
  return v < 500 ? 1 : v < 1000 ? .8 : v < 4000 ? .6 : v < 7000 ? .4 : .2
}

const weightTransaction = (v, min, max) => {
  if (max - min === 0) return 0
  if (v === 0) return 0

  // console.log('weight not zero', ((v - min) / (max - min)) || 0)
  
  return ((v - min) / (max - min)) || 0
}

const weightFavorite = weightTransaction

export default async (obj, { 
  lat,
  long
}, { scope, user }) => {
  // if (!scope.includes('nearbyRestaurant')) {
  //   throw new Error('Permission Denied')
  // }

  try {
    let nearbyResto = await findNearbyRestaurants({lat, long})
    
    let dataset = []
    let menus = []

    let minPrice = Number.MAX_SAFE_INTEGER
    let maxPrice = Number.MIN_SAFE_INTEGER
    let minDistance = Number.MAX_SAFE_INTEGER
    let maxDistance = Number.MIN_SAFE_INTEGER
    let minWeightedTransaction = Number.MAX_SAFE_INTEGER
    let maxWeightedTransaction = Number.MIN_SAFE_INTEGER
    let minWeightedFavorites = Number.MAX_SAFE_INTEGER
    let maxWeightedFavorites = Number.MIN_SAFE_INTEGER
    let minTransaction = Number.MAX_SAFE_INTEGER
    let maxTransaction = Number.MIN_SAFE_INTEGER
    let minFavorites = Number.MAX_SAFE_INTEGER
    let maxFavorites = Number.MIN_SAFE_INTEGER

    let priceWeight = .2
    let distanceWeight = .1
    let transactionWeight = .3
    let favoriteWeight = .4

    for (let resto of nearbyResto) {
      let restaurantMenus = await resto.getRestaurantMenus()

      for (let menu of restaurantMenus) {
        menu.restaurant_id = resto.id
        let data = {
          price: menu.price,
          distance: resto.distance, //meter
          transactionsNumber: (await menu.getOrderItems()).length,
          favoritesNumber: (await menu.getFavorites()).length
        }

        if (data.transactionsNumber > maxTransaction) maxTransaction = data.transactionsNumber
        if (data.transactionsNumber < minTransaction) minTransaction = data.transactionsNumber

        if (data.favoritesNumber > maxFavorites) maxFavorites = data.favoritesNumber
        if (data.favoritesNumber < minFavorites) minFavorites = data.favoritesNumber

        dataset.push(data)
        menus.push(menu)
      }
    }

    // console.log(maxTransaction, minTransaction)
    // console.log('dataset', dataset)

    minPrice = Number.MAX_SAFE_INTEGER
    maxPrice = Number.MIN_SAFE_INTEGER
    minDistance = Number.MAX_SAFE_INTEGER
    maxDistance = Number.MIN_SAFE_INTEGER

    let weightedDataset = dataset.map(d => {
      let data = {
        price: weightPrice(d.price),
        distance: weightDistance(d.distance),
        transactionsNumber: weightTransaction(d.transactionsNumber, minTransaction, maxTransaction),
        favoritesNumber: weightFavorite(d.favoritesNumber, minFavorites, maxFavorites),
      }

      if (data.price >= maxPrice) maxPrice = data.price
      if (data.price <= minPrice) minPrice = data.price

      if (data.distance >= maxDistance) maxDistance = data.distance
      if (data.distance <= minDistance) minDistance = data.distance

      if (data.transactionsNumber >= maxWeightedTransaction) 
        maxWeightedTransaction = data.transactionsNumber
      if (data.transactionsNumber <= minWeightedTransaction) 
        minWeightedTransaction = data.transactionsNumber

      if (data.favoritesNumber >= maxWeightedFavorites) 
        maxWeightedFavorites = data.favoritesNumber
      if (data.favoritesNumber <= minWeightedFavorites) 
        minWeightedFavorites = data.favoritesNumber

      return data
    })

    // console.log(maxTransaction, minTransaction)
    // console.log('weighted dataset', weightedDataset)

    let normalizedAndCalculatedDataset = weightedDataset.map(d => ({
      price: d.price / maxPrice * priceWeight,
      distance: d.distance / maxDistance * distanceWeight,
      transactionsNumber: maxWeightedTransaction === 0
        ? 0
        : d.transactionsNumber / maxWeightedTransaction * transactionWeight,
      favoritesNumber: maxWeightedFavorites === 0
        ? 0
        : d.favoritesNumber / maxWeightedFavorites * favoriteWeight,
    }))

    let finalDataset = normalizedAndCalculatedDataset.map(
      d => d.price + d. distance + d.transactionsNumber + d.favoritesNumber
    )

    menus.forEach((d, i) => d.rating = finalDataset[i])
    menus.sort((a, b) => b.rating - a.rating)

    let finalResto = []
    let finalRestoId = []
    for (let menu of menus) {
      let resto = await db.models.Restaurant.findByPk(menu.restaurant_id)
      if (finalRestoId.indexOf(menu.restaurant_id) === -1) {
        resto.rating = menu.rating
        finalResto.push(resto)
        finalRestoId.push(menu.restaurant_id)
      }
    }

    // console.log('Final resto length', finalResto.length)
    // if (finalResto.length > 1) console.log(finalResto[0].id)
    
    return finalResto
  } catch (error) {
    throw error
  }
}