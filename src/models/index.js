import connection from './connection'
import { events, DB_CONNECTED } from '../events'

// import User from './User')
import './Karyawan'

import { giveSeeds } from '../seeders'

let force = false

connection
  .sync({
    force
  })
  .then(async () => {
    console.log('database synchronized')

    events.emit(DB_CONNECTED)
    if (force) giveSeeds() 
    //`${a.substr(6, 4)}-${a.substr(3, 2)}-${a.substr(0, 2)}`
    // let karyawans = await connection.models.Karyawan.findAll()


    // for (let karyawan of karyawans) {
    //   let a = karyawan.tanggal_lahir
    //   karyawan.tanggal_lahir = `${a.substr(6, 4)}-${a.substr(3, 2)}-${a.substr(0, 2)}`
    //   a = karyawan.tmt_pangkat_terakhir
    //   karyawan.tmt_pangkat_terakhir = `${a.substr(6, 4)}-${a.substr(3, 2)}-${a.substr(0, 2)}`
    //   a = karyawan.tmt_gaji_berkala_terakhir
    //   karyawan.tmt_gaji_berkala_terakhir = `${a.substr(6, 4)}-${a.substr(3, 2)}-${a.substr(0, 2)}`
    //   a = karyawan.pensiun
    //   karyawan.pensiun = `${a.substr(6, 4)}-${a.substr(3, 2)}-${a.substr(0, 2)}`
    //   await karyawan.save()
    // }
  })
  .catch(err => {
    console.log(err)
  })
  
export default connection
