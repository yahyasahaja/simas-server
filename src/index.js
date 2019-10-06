//MODULES
import Express from 'express'
// import path from 'path'
import compression from 'compression'
import bodyParser from 'body-parser'
import Sequelize from 'sequelize'
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

app.get('/karyawan', async (req, res) => {
  let { page = 0, limit = 10, search } = req.query
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

  try {
    let { rows: karyawan, count } = await db.models.Karyawan.findAndCountAll(
      pagination
    )
    
    res.json({
      karyawan,
      totalPages: Math.floor(count / limit),
    })
  } catch (err) {
    throw new Error(err)
  }
})

app.get('/pensiun', async (req, res) => {
  let { page = 0, limit = 10 } = req.query
  try {
    let { rows: karyawan, count } = await db.models.Karyawan.findAndCountAll(
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
    
    res.json({
      karyawan,
      totalPages: Math.ceil(count / limit),
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