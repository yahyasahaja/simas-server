//MODULES
import Express from 'express'
import graphqlExpress from 'express-graphql'
import jwt from 'jsonwebtoken'
// import path from 'path'
import cors from 'cors'
import compression from 'compression'
import { apolloUploadExpress } from 'apollo-upload-server'
import bodyParser from 'body-parser'
import path from 'path'

//SCHEMA_RESTAURANT
import schema from './modules/schema'

//EVENTS
import { DB_CONNECTED, events } from './events'

//DATABASE
import db from './models'

//CONFIG
import { JWT, USER_TYPE } from './config'

//INNER_CONFIG
const PORT = process.env.NODE_ENV === 'development' ? 8080 : 9090
let app = Express()

//PARSER
bodyParser.urlencoded({extended: true})

//CUSTOM_CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

//COMPRESSION
app.use(compression())

//FIREBASE 
import * as admin from 'firebase-admin'
import serviceAccountKey from './service-account-key'
import { findNearbyRestaurants } from './utils'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: 'https://sans-99bdf.firebaseio.com'
})

app.use(Express.static(path.join(__dirname, '../uploads')))
console.log(path.join('./uploads'))

//AUTH
async function authMiddleware(req, res, next) {
  // pre define context scope
  req.state = { scope: [] }

  try {
    const authHeader = req.headers.authorization || req.headers.Authorization 

    if (authHeader && authHeader.length > 0) {
      const [scheme, token] = authHeader.split(' ')

      if (!/^Bearer$/i.test(scheme)) return res.status(401).json({
        error: 'Bad token format'
      })

      const dtoken = jwt.verify(token, JWT.SECRET_KEY)
      
      req.state = { ...req.state, ...dtoken }

      if (dtoken.userType === USER_TYPE.RESTAURANT)
        req.state.user = await db.models.RestaurantAdmin.findById(dtoken.userId)
      else if (dtoken.userType === USER_TYPE.CUSTOMER)
        req.state.user = await db.models.Customer.findById(dtoken.userId)
      else {
        req.state.user = {
          id: 0,
          name: USER_TYPE.GUEST,
          email: ''
        }

        req.userType = req.state.userType = USER_TYPE.GUEST
      }
    }

    await next()
  } catch (err) {
    res.status(401).json({
      error: err.message
    })
  }
}

//GRAPHQL
app.use(
  '/graphql',
  authMiddleware,
  bodyParser.json(),
  cors(),
  apolloUploadExpress(),
  graphqlExpress(req => ({
    schema,
    pretty: true,
    graphiql: true,
    context: {
      JWT_SECRET_KEY: JWT.SECRET_KEY,
      ...req.state
    }
  }))
)

app.use(bodyParser.json())

app.get('/test', (req, res) => {
  res.json({
    data: 'OK'
  })
})

app.get('/teststring', (req, res) => {
  res.send('ini string')
})

app.post('/test', (req, res) => {
  // console.log(req)
  res.json({
    bodyMu: req.body,
  })
})

app.get('/menu2', async (req, res) => {
  let nearbyResto = await findNearbyRestaurants({lat:'-7.953681', long:'112.614662'})

    
  let dataset = []

  for (let resto of nearbyResto) {
    let restaurantMenus = await resto.getRestaurantMenus()

    for (let menu of restaurantMenus) {
      let data = {
        ...menu.dataValues,
        price: menu.price,
        distance: resto.distance/1000, //meter
        distance_unit: 'km',
        transactionsNumber: Math.floor(Math.random() * 50) + 1,
        favoritesNumber: Math.floor(Math.random() * 50) + 1,
        restaurant_name: resto.name
      }

      dataset.push(data)
    }
  }

  console.log('menus', dataset)
  res.json(dataset)
})

app.get('/menu', async (req, res) => {
  let nearbyResto = await findNearbyRestaurants({lat:'-7.953681', long:'112.614662'})

    
  let dataset = []

  for (let resto of nearbyResto) {
    let restaurantMenus = await resto.getRestaurantMenus()

    for (let menu of restaurantMenus) {
      menu.restaurant_id = resto.id
      let data = {
        ...menu.dataValues,
        price: menu.price,
        distance: resto.distance, //meter
        transactionsNumber: (await menu.getOrderItems()).length,
        favoritesNumber: (await menu.getFavorites()).length,
        resto: {...resto.dataValues}
      }

      dataset.push(data)
    }
  }

  console.log('menus', dataset)
  res.json(dataset)
})

app.get('/payment', async (req, res) => {
  let { key, email, balance } = req.query

  if (key !== 'hayolo123') return res.send('O tida bisa :p')

  let customer = await db.models.Customer.findOne({
    where: {email}
  })

  let payment = await customer.getPayment()
  payment.balance = balance
  await payment.save()
  res.send('OK')
})

setInterval(async () => {
  await db.query(
    `update Orders set status = "COMPLETE" where status = "PROCESS" and end_process_date > ${Date.now()}`
  )
}, 120000)

//START_SERVER 
//LISTEN TO PORT
events.on(DB_CONNECTED, () => {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running at port ${PORT}`))
})