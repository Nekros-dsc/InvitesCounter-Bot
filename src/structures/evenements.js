/* eslint-disable no-undef */
import { EXTANDED_CLIENT } from '../../index.js'

export class Evenement {
  /**
    * @param { { eventName: import("discord.js").ClientEvents, callback: Function } } evenementOptions
    */

  constructor (evenementOptions = { eventName, callback }) {
    EXTANDED_CLIENT.events.set(Object.keys(evenementOptions.eventName)[0], evenementOptions)
    EXTANDED_CLIENT.on(Object.keys(evenementOptions.eventName)[0], async (...args) => evenementOptions.callback(EXTANDED_CLIENT, ...args))
  }
}
