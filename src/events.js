//MODULES
import EventEmitter from 'events'

//INIT
export const events = new EventEmitter()

//EVENT_NAMES
export const DB_CONNECTED = 'dbConnected'

//DEFAULT
export default {
  events,
  DB_CONNECTED,
}