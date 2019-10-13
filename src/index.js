//MODULES
import Express from 'express'
// import path from 'path'
import compression from 'compression'
import bodyParser from 'body-parser'
import Sequelize from 'sequelize'
import jwt from 'jsonwebtoken'
// import path from 'path'

//EVENTS
import { DB_CONNECTED, events } from './events'

//DATABASE
import db from './models'

import { paginate } from './utils'

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

const SECRET = 'simas1232425(*9hreh8989*989J()#$'

app.get('/login', async (req, res) => {
  let {
    username,
    password
  } = req.body

  if (username === 'admin' && password === 'admin') {
    let token = jwt.sign({
      name: 'Admin'
    }, SECRET)

    res.status(200).json({
      is_ok: true,
      token,
    })
  }
})

// app.use((req, res, next) => {
//   let token = req.headers.Authorization
//   if (token) {
//     req.isLoggedIn = true
//     req.token = token
//     next()
//   }

//   res.status(401).json({
//     message: 'Unauthenticated'
//   })
// })

app.get('/karyawan', async (req, res) => {
  let { page = 0, limit = 10, search = '' } = req.query
  page = parseInt(page)
  limit = parseInt(limit)

  let where = {}

  if (search) {
    where = {
      [Sequelize.Op.or]: [
        {
          nama: {
            [Sequelize.Op.like]: `%${search}%`,
          }
        },
        {
          nip: {
            [Sequelize.Op.like]: `%${search}%`,
          }
        },
      ]
    }
  }

  let pagination = {}

  if (page || limit || search) pagination = paginate(
    { where },
    { page, limit }
  )

  console.log('pagination', pagination, where, search)

  try {
    let { rows: data, count } = await db.models.Karyawan.findAndCountAll(
      pagination
    )

    let totalPages = Math.ceil(count / limit)
    
    res.json({
      data,
      meta: {
        totalPages,
        page,
      },
      links: {
        prev: page !== 0,
        next: page !== totalPages
      },
    })
  } catch (err) {
    throw new Error(err)
  }
})

app.get('/pensiun', async (req, res) => {
  let { page = 0, limit = 10 } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  
  try {
    let { rows: data, count } = await db.models.Karyawan.findAndCountAll(
      paginate(
        { where: {
          [Sequelize.Op.and]: [
            {
              pensiun: {
                [Sequelize.Op.lt]: new Date()
              }
            },
            {
              pensiun: {
                [Sequelize.Op.notLike]: '0000-00-00'
              }
            },
          ]}
        },
        { page, limit }
      )
    )

    let totalPages = Math.ceil(count / limit)
    
    res.json({
      data,
      meta: {
        totalPages,
        page,
      },
      links: {
        prev: page !== 0,
        next: page !== totalPages
      },
    })
  } catch (err) {
    throw new Error(err)
  }
})

// app.get('/pensiun', async (req, res) => {
//   let { page, limit } = req.query
//   try {
//     let { rows: karyawan, count: totalCount } = await db.models.Karyawan.findAndCountAll(
//       paginate(
//         { where: {
//           pensiun: {
//             [Sequelize.Op.lt]: new Date()
//           }
//         }},
//         { page, limit }
//       )
//     )
    
//     res.json({
//       karyawan,
//       totalCount,
//     })
//   } catch (err) {
//     throw new Error(err)
//   }
// })

//START_SERVER 
//LISTEN TO PORT
events.on(DB_CONNECTED, () => {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running at port ${PORT}`))
})