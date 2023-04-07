import { ExtandedClient } from './src/structures/client.js'
import { readFileSync } from 'fs'
const config = JSON.parse(readFileSync('./config.json', 'utf-8'))

export const EXTANDED_CLIENT = new ExtandedClient(
  {
    eventDir: '../events/',
    commandDir: '../commands/',
    clientToken: config.clientToken,
    clientOptions: { intents: 3276799, presence: { activities: [{ type: 'WATCHING', name: 'InvitesCounter' }] } }
  }
)
