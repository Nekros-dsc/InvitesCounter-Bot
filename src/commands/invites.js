/* eslint-disable no-unused-vars */
import {
  EmbedBuilder,
  Message,
  Client,
  Collection
} from 'discord.js'
import {
  Command
} from '../structures/commands.js'
export default new Command({
  name: 'invites',
  description: ['Affiche le nombre d\'invites d\'un membre', 'Displays the number of invites for the member'],
  category: 'util',
  usage: 'invites [member]',
  aliases: ['inv', 'i', 'invite'],
  userPermissions: 'EVERYONE',

  /**
       * @param { { commands: Collection, events: Collection, db: Database} & Client } client
       * @param { Message } message
       */

  async callback (client, message, args, lang) {
    const a = Date.now()
    const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member
    const data = await client.db.get(`invites_${message.guild.id}_${member.id}`) || {
      total: 0,
      valid: 0,
      left: 0,
      bonus: 0
    }
    const embed = new EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true }) })
      .setDescription(`*${lang.invites.generatedIn} ${Date.now() - a}ms*\n\n**${member.user.username}**\n\`${data.total} invites\` (**${data.valid}** ${lang.invites.valid} **${data.bonus}** Bonus **${data.left}** ${lang.invites.left})`)
      .setColor('Green')
      .setFooter({ iconURL: client.user.avatarURL(), text: `+ InvitesCounter | ${lang.inviteconfig.requestedby} ${member.user.username}` })
    return message.channel.send({ embeds: [embed] })
  }
})
