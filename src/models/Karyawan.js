import Sequelize from 'sequelize'
import connection from './connection'

export default connection.define(
  'Karyawan',
  {
    nama: {
      type: Sequelize.STRING(50),
    },
    nip: {
      type: Sequelize.STRING(22),
    },
    tempat_lahir: {
      type: Sequelize.STRING(30),
    },
    tanggal_lahir: {
      type: Sequelize.STRING(30),
    },
    pendidikan: {
      type: Sequelize.STRING(20),
    },
    jabatan: { 
      type: Sequelize.STRING(100),
    },
    pangkat: {
      type: Sequelize.STRING(10),
    },
    tmt_pangkat_terakhir: {
      type: Sequelize.STRING(50),
    },
    masa_kerja: {
      type: Sequelize.STRING(50),
    },
    gaji_berkala: {
      type: Sequelize.STRING(50),
    },
    tmt_gaji_berkala_terakhir: {
      type: Sequelize.STRING(50),
    },
    masa_kerja_gaji_berkala: {
      type: Sequelize.STRING(50),
    },
    pensiun: {
      type: Sequelize.STRING(50),
    },
  },
  {
    underscored: true,
    timestamps: false
  }
)
