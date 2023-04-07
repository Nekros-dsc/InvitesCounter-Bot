/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
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
  eventName: { guildMemberRemove: 0 },

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
      const data = await client.db.get(`invitesconfig.${member.guild.id}`)
      const channel = client.channels.cache.find(c => c.id === data.goodbyelounge)
      const invitedBy = await client.db.get(`invitedby_${member.id}_${guild.id}`)
      if (!invitedBy) {
        return channel.send({ content: `${member} left the server, I don't know who invited him.` })
      } else {
        const user = client.users.cache.find(u => u.id === invitedBy)
        if (!user) {
          return channel.send(`${member} left the server, I don't know who invited him.`)
        } else {
          const invitesOfUser = await client.db.get(`invites_${guild.id}_${user.id}`) || {
            total: 0,
            valid: 0,
            left: 0,
            bonus: 0
          }
          invitesOfUser.valid--
          invitesOfUser.left++
          await client.db.set(`invites_${guild.id}_${user.id}`, invitesOfUser)
          if (!data.goodbyemsg) return
          return channel.send(`${replace(data.goodbyemsg, member.user, user, invitesOfUser, member.guild)}`)
        }
      }
    } catch (err) {
    }
  }
})
