/* eslint-disable no-unused-vars */
import { Evenement } from '../structures/evenements.js'
import Discord from 'discord.js'
function replace (msg, user, inviter, inviterinfo, guild) {
  return msg
    .replace('{userId}', user.id)
    .replace('{userTag}', user.tag)
    .replace('{userUsername}', user.tag)
    .replace('{user}', user)
    .replace('{inviterId}', inviter.id)
    .replace('{inviterTag}', inviter.tag)
    .replace('{inviterUsername}', inviter.username)
    .replace('{inviter}', inviter)
    .replace('{inviterInvitations}', inviterinfo.valid)
    .replace('{guildName}', guild.name)
    .replace('{guildId}', guild.id)
    .replace('{guildCount}', guild.memberCount)
}

export default new Evenement({
  eventName: { inviteFoundInGuild: 0 },

  /**
     * @param { Discord.Message } message
     * @param {{ commands: Discord.Collection, events: Discord.Collection, aliases: Discord.Collection, config: Object } & Discord.Client} client
     */

  async callback (client, guild, member, invite, inviteUser) {
    try {
      console.log('oe')
      const data = await client.db.get(`invitesconfig.${member.guild.id}`)
      const channel = client.channels.cache.find(c => c.id === data.welcomelounge)
      if (member.id === inviteUser.id) {
        return channel.send(`${member} has invited himself.`)
      } else {
        const invitesOfUser = await client.db.get(`invites_${guild.id}_${inviteUser.id}`) || {
          total: 0,
          valid: 0,
          left: 0,
          bonus: 0
        }
        invitesOfUser.total++
        invitesOfUser.valid++
        await client.db.set(`invites_${guild.id}_${inviteUser.id}`, invitesOfUser)
        await client.db.set(`invitedby_${member.id}_${guild.id}`, inviteUser.id)
        if (!data.welcomemsg) return
        const msg = replace(data.welcomemsg, member.user, inviteUser, invitesOfUser, guild)
        channel.send(`${msg}`)
      }
    } catch (err) {
      console.log(err)
    }
  }
})
