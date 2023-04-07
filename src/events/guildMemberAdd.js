/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { Evenement } from '../structures/evenements.js'
import Discord from 'discord.js'

export default new Evenement({
  eventName: { guildMemberAdd: 0 },

  /**
     * @param { Discord.Message } message
     * @param { Discord.GuildMember } member
     * @param {{ commands: Discord.Collection, events: Discord.Collection, aliases: Discord.Collection } & Discord.Client} client
     */

  async callback (client, member) {
    try {
      if (!member) return
      const { guild } = member
      if (!guild) return
      const currentInvites = await guild.invites.fetch().catch(e => { console.log(e) })
      if (!currentInvites) return
      const usedInvite = currentInvites.find(invite => invite.uses > client.invitesCache.get(`${invite.code}_${guild.id}`))
      if (!usedInvite) currentInvites.find(invite => !client.invitesCache.has(`${invite.code}_${guild.id}`))
      if (usedInvite) {
        client.invitesCache.set(`${usedInvite.code}_${guild.id}`, usedInvite.uses)
        const inviter = usedInvite.inviter
        return client.emit('inviteFoundInGuild', guild, member, usedInvite, inviter)
      } else if (guild.features.includes('VANITY_URL')) {
        const cacheUses = client.vanityCache.get(`${guild.id}`)
        if (!cacheUses) {
          return client.emit('inviteNotFoundInGuild', guild, member)
        } else {
          const vanityCurrent = await guild.fetchVanityData().catch(e => { console.log(e) })
          if (!vanityCurrent) return client.emit('inviteNotFoundInGuild', guild, member)
          if (vanityCurrent.uses <= cacheUses) return client.emit('inviteNotFoundInGuild', guild, member)
          else return client.emit('inviteWithVanity', guild, member, vanityCurrent)
        }
      } else {
        return client.emit('inviteNotFoundInGuild', guild, member)
      }
    } catch (err) {
      console.log(err)
    }
  }
})
