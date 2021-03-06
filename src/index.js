//MODULES
import Express from 'express'
// import path from 'path'
import compression from 'compression'
import bodyParser from 'body-parser'
import Sequelize from 'sequelize'
import jwt from 'jsonwebtoken'
import cors from 'cors'
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
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing

//CUSTOM_CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

app.use(cors())

//COMPRESSION
app.use(compression())


function formatDate(s) {
  let res = s
  let year = s.substr(6, 4)
  let month = s.substr(3, 2)
  let day = s.substr(0, 2)

  if (s.substr(0, 4).indexOf('-') !== -1) {
    res = `${year}-${month}-${day}`

    if (res === '--') res = '0000-00-00'
  }

  return res
}

app.get('/reformatdate', async (req, res) => {
  let karyawans = await db.models.Karyawan.findAll()
  
  for (let k of karyawans) {
    k.pensiun = formatDate(k.pensiun)
    k.tmt_pangkat_terakhir = formatDate(k.tmt_pangkat_terakhir)
    k.tmt_gaji_berkala_terakhir = formatDate(k.tmt_gaji_berkala_terakhir)
    k.tanggal_lahir = formatDate(k.tanggal_lahir)
    await k.save()
  }

  res.json(karyawans)
})

const SECRET = 'simas1232425(*9hreh8989*989J()#$'

let auth = Express.Router()
//login
//request post
auth.post('/login', async (req, res) => {
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

  res.status(401).json({
    is_ok: false,
    message: 'Wrong username or password'
  })
})

app.use('/auth', auth)

let secure = Express.Router()

secure.use((req, res, next) => {
  let bearerToken = req.headers.authorization
  if (bearerToken) {
    let bearer = bearerToken.split(' ')[0]
    let token = bearerToken.split(' ')[1]

    if (bearer && token) {
      let isVerified = jwt.verify(token, SECRET)
      if (isVerified) {
        req.isLoggedIn = true
        req.token = token
        next()
        return
      }
    }
  }

  res.status(401).json({
    message: 'Unauthenticated'
  })
})

secure.get('/karyawan', async (req, res) => {
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
        totalCount: count,
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

secure.post('/karyawan', async (req, res) => {
  try {
    let body = req.body

    await db.models.Karyawan.create(body)
    res.status(201).json({
      is_ok: true,
      message: 'Data berhasil ditambahkan'
    })
  } catch (err) {
    res.status(500).json({
      is_ok: false,
      message: err.message
    })
  }
})

secure.delete('/karyawan/:id', async (req, res) => {
  try {
    await db.models.Karyawan.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(201).json({
      is_ok: true,
      message: 'Data berhasil dihapus'
    })
  } catch (err) {
    res.status(500).json({
      is_ok: false,
      message: err.message
    })
  }
})

secure.patch('/karyawan/:id', async (req, res) => {
  try {
    let karyawan = await db.models.Karyawan.findByPk(req.params.id)
    let body = req.body

    if (karyawan) {
      for (let i in body) {
        karyawan[i] = body[i]
      }

      await karyawan.save()
      return res.status(200).json({
        is_ok: true
      })
    }
    
    res.status(404).json({
      message: 'Not found'
    })
  } catch (err) {
    throw new Error(err)
  }
})

secure.get('/pensiun', async (req, res) => {
  let { page = 0, limit = 10, search } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  
  try {
    let { rows: data, count } = await db.models.Karyawan.findAndCountAll(
      paginate(
        { where: {
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
          ],
          [Sequelize.Op.and]: [
            {
              pensiun: {
                [Sequelize.Op.gt]: new Date()
              }
            },
            {
              pensiun: {
                [Sequelize.Op.notLike]: '0000-00-00'
              }
            },
          ]},
        order: [['pensiun', 'ASC']],
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
        totalCount: count,
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

secure.get('/pangkat', async (req, res) => {
  let { page = 0, limit = 10, month = '04', search = '' } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  
  try {
    let { rows: data, count } = await db.models.Karyawan.findAndCountAll(
      paginate(
        { where: {
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
          ],
          [Sequelize.Op.and]: [
            {
              tmt_pangkat_terakhir: {
                [Sequelize.Op.lt]: new Date()
              }
            },
            {
              tmt_pangkat_terakhir: {
                [Sequelize.Op.notLike]: '0000-00-00'
              }
            },
            {
              tmt_pangkat_terakhir: {
                [Sequelize.Op.like]: `%-${month}-%`
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
        totalCount: count,
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

app.use('/', secure) 

//START_SERVER 
//LISTEN TO PORT
events.on(DB_CONNECTED, () => {
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running at port ${PORT}`))
})