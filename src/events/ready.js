/* eslint-disable no-unused-vars */
import { Evenement } from '../structures/evenements.js'
import chalk from 'chalk'

export default new Evenement(
  {
    eventName: { ready: 0 },

    /**
         * @param { { commands: Collection, events: Collection } & Client } client
        */

    async callback (client) {
      console.log(chalk.blue('Prêt sur ') + chalk.red(`${client.user.tag}`))
      process.on('unhandledRejection', async (err) => {
        return console.log(err)
      })
      process.on('uncaughtException', async (err) => {
        return console.log(err)
      })
      client.guilds.cache.map(async guild => {
        guild.invites.fetch().then(async invites => {
          let index = 0
          for (const [, invite] of invites) {
            client.invitesCache.set(`${invite.code}_${guild.id}`, invite.uses)
            index++
          }
        }).catch(e => {
          return console.log('Une erreur est survenue lors de la mise en cache des invitations : ' + e)
        })
        if (!guild.features.includes('VANITY_URL')) return
        guild.fetchVanityData().then(async vanity => {
          client.vanityCache.set(`${guild.id}`, vanity.uses)
        }).catch(e => {
          return console.log('Une erreur est survenue lors de la mise en cache des vanity : ' + e)
        })
      })
    }
  }
)
