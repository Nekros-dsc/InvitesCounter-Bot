/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { Evenement } from '../structures/evenements.js'
import Discord from 'discord.js'

export default new Evenement({
  eventName: { inviteCreate: 0 },

  /**
     * @param { Discord.Message } message
     * @param { Discord.Invite } invite
     * @param {{ commands: Discord.Collection, events: Discord.Collection, aliases: Discord.Collection } & Discord.Client} client
     */

  async callback (client, invite) {
    try {
      client.invitesCache.set(`${invite.code}_${invite.guild.id}`, invite.uses)
    } catch (err) {
      console.log(err)
    }
  }
})
