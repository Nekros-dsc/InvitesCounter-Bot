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
  name: 'leaderboard',
  description: ['Affiche le classement des invitations', 'Displays the leaderboard of invitations'],
  category: 'util',
  usage: 'leaderboard',
  aliases: ['lb', 'top'],
  userPermissions: 'EVERYONE',

  /**
         * @param { { commands: Collection, events: Collection, db: Database} & Client } client
         * @param { Message } message
         */

  async callback (client, message, args, lang) {
    const top = []
    message.channel.send('...')
    message.guild.members.cache.map(async member => {
      const data = await client.db.get(`invites_${message.guild.id}_${member.user.id}`)
      if (!data) return
      top.push({ member: member.user.username, invites: data.total ? data.total : 0 })
    })
    const lb = top.sort((a, b) => b.invites - a.inv)
    setTimeout(() => {
      const embed = new EmbedBuilder()
        .setTitle('Leaderboard -> ' + message.guild.name)
        .setDescription(`${lb.map(function (data, index) { return `${index + 1}. **\`${data.member}\`** - **${data.invites}** invitations` }).splice(0, 15).join('\n')}`)
        .setColor('Green')
      return message.reply({ embeds: [embed] })
    }, 10000)
  }
})
