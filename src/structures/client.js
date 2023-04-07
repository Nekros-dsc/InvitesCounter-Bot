/* eslint-disable no-unused-expressions */
import { Client, Collection } from 'discord.js'
import { readFileSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { Database } from 'quickmongo'
import translate from '@plainheart/google-translate-api'

export class ExtandedClient extends Client {
  constructor ({ clientOptions, clientToken, eventDir, commandDir }) {
    super(clientOptions)

    this.events = new Collection()
    this.commands = new Collection()
    this.aliases = new Collection()
    this.config = JSON.parse(readFileSync('./config.json', 'utf-8'))
    this.db = new Database(this.config.mongoUrl)
    this.translate = translate
    this.invitesCache = new Collection()
    this.vanityCache = new Collection()
    this.#init({ token: clientToken, commandDir, eventDir })
  }

  async #init ({ token, commandDir, eventDir }) {
    await this.#eventsInit(eventDir)
    await this.#commandsInit(commandDir)
    await this.login(token)
    await this.db.connect().then(() => console.log('Base de données connectée')).catch(err => console.log('Erreur avec la base de données : \n' + err))
  }

  async #commandsInit (commandDir) {
    readdirSync(join(dirname(fileURLToPath(import.meta.url)), commandDir)).filter(async file => {
      file ? file.endsWith('.js') ? (await import(commandDir + file))?.default : null : null
    }
    )
  }

  async #eventsInit (eventDir) {
    readdirSync(join(dirname(fileURLToPath(import.meta.url)), eventDir)).filter(async file => {
      file ? file.endsWith('.js') ? (await import(eventDir + file))?.default : null : null
    }
    )
  }
}
