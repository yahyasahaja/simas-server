import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { JWT, USER_TYPE } from './config'
import mkdirp from 'mkdirp'
import shortid from 'shortid'
import db from './models'
import fs from 'fs'
import { createClient } from '@google/maps'

const mapsClient = createClient({
  key: 'AIzaSyAP3f2TzR_OaLDY6kahY_F-mkO-DOHMEYI',
  Promise: Promise
})

//CONFIG
const uploadDir = './uploads'
mkdirp.sync(uploadDir)

//UTILS
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'takisinaja@gmail.com',
    pass: 'takis123'
  }
})

export const sendEmailVerification = async (user, userType) => {
  let { name, id: userId, email } = user
  let token = jwt.sign(
    {
      userId,
      userType,
      email
    },
    JWT.SECRET_KEY
  )

  user.verification_token = token
  await user.save()
  
  let domain = `${userType === USER_TYPE.CUSTOMER ? '' : 'mitra'}.ngopi.men`
  let link = `https://${domain}/token/${token}`

  const mailOptions = {
    from: 'takisinaja@gmail.com',
    to: email,
    subject: 'Email Verification',
    html: `
      <h1>Hi ${name}, welcome to Takis</h1>
      <p>To verify your email, please click the Verify Email bellow</p>
      <div style='margin-top: 38px;
      margin-bottom: 8px;' >
      <a style='padding: 10px 20px;
      border-radius: 10px;
      color: white;
      background: #00BCD4;
      text-decoration: none;' href=${link}>Verify Email</a>
      </div>
      <br />
      <p>or if it is not working you can just copy this link and paste it into your browser</p>
      ${link}
    `
  }

  return await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        reject(error)
      } else {
        console.log('Email sent: ' + info.response)
        resolve(info.response)
      }
    })
  })
}

export const storeFS = ({ stream, filename }) => {
  const id = shortid.generate()
  const path = `${uploadDir}/${id}-${filename}`
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(path)
        reject(error)
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ id, path }))
  )
}

export const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload
  const { id, path } = await storeFS({ stream, filename })
  return await db.models.Uploads.create({ id, filename, mimetype, encoding, path })
}

export const getEuclideanDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)  // deg2rad below
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

export const deg2rad = deg => {
  return deg * (Math.PI / 180)
}

export const findNearbyRestaurants = async (target) => {
  let MAX_DISTANCE = 20 //in km
  let restaurants = 
    (await db.models.Restaurant.findAll())
      .filter(restaurant => {
        let distance = getEuclideanDistance(
          target.lat,
          target.long,
          restaurant.lat,
          restaurant.long
        )

        console.log(distance)
        return distance < MAX_DISTANCE //in km
      })
  
  
  target = {lat: target.lat, lng: target.long}
  const restoPositions = restaurants.map(restaurant => {
    return { lat: restaurant.lat, lng: restaurant.long }
  })

  // console.log(target)
  // console.log(restoPositions)

  // let nearestDistance = Number.POSITIVE_INFINITY;
  // let nearestRestoIndex = 0;
  const resp = await mapsClient.distanceMatrix({
    avoid: ['tolls', 'highways', 'ferries'],
    mode: 'driving',
    units: 'metric',
    destinations: [target],
    origins: restoPositions,
  }).asPromise()

  resp.json.rows.forEach((row, i) => {
    restaurants[i].distance = row.elements[0].distance.value

    // if (row.elements[0].distance.value < nearestDistance) {
    //   nearestDistance = row.elements[0].distance.value;
    //   nearestRestoIndex = i;
    // }
  })

  restaurants = restaurants
    .sort((a, b) => a.distance - b.distance)
    .filter(d => d.distance < MAX_DISTANCE * 1000)
  // console.log(restaurants[1].distance)
  return Promise.resolve(restaurants) //ASC
}


export default {
  sendEmailVerification,
  storeFS,
  processUpload,
  getEuclideanDistance,
  deg2rad,
}