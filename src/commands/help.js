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
  name: 'help',
  description: ['Montre les commandes', 'Show commands'],
  category: 'util',
  usage: 'help [command]',
  aliases: ['h', 'aide'],
  userPermissions: 'EVERYONE',

  /**
   * @param { { commands: Collection, events: Collection, db: Database} & Client } client
   * @param { Message } message
   */

  async callback (client, message, args) {
    const language = await client.db.get(`lang_${message.guild.id}`)
    if (!args[0]) {
      if (language === 'fr') {
        const admincmd = client.commands.filter(cmd => cmd.category === 'admin').map(function (command) { return `\`${command.name}\` : ${command.description[0]}` }).join('\n')
        const utilcmd = client.commands.filter(cmd => cmd.category === 'util').map(function (command) { return `\`${command.name}\` : ${command.description[0]}` }).join('\n')
        const embed = new EmbedBuilder()
          .setDescription(`[**Page d'aide de InvitesCounter**](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=24)\nPrefix: \`=\`\n\n`)
          .addFields([
            {
              name: '⚙️・ Admin:',
              value: `${admincmd}\n`
            },
            {
              name: '📌・ Util:',
              value: `${utilcmd}`
            }
          ])
          .addFields([
            {
              name: ' ',
              value: `[\`Cliquez ici pour utiliser le bot !\`](https://discord.gg/zM6ZN9UfRs) [\`Cliquez ici pour ajouter le bot\`](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=24)`
            }
          ])
          .setColor('Green')
          .setFooter({ text: '©️ InvitesCounter' })
          .setTimestamp(Date.now())

        return message.channel.send({ embeds: [embed] })
      } else {
        const admincmd = client.commands.filter(cmd => cmd.category === 'admin').map(function (command) { return `\`${command.name}\` : ${command.description[1]}` }).join('\n')
        const utilcmd = client.commands.filter(cmd => cmd.category === 'util').map(function (command) { return `\`${command.name}\` : ${command.description[1]}` }).join('\n')
        const embed = new EmbedBuilder()
          .setDescription(`[**InvitesCounter help page**](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=24)\nPrefix: \`=\`\n\n`)
          .addFields([
            {
              name: '⚙️・ Admin:',
              value: `${admincmd}\n`
            },
            {
              name: '📌・ Util:',
              value: `${utilcmd}`
            }
          ])
          .addFields([
            {
              name: ' ',
              value: `[\`Click here to use the bot !\`](https://discord.gg/zM6ZN9UfRs) [\`Click here to add the bot\`](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=24)`
            }
          ])
          .setColor('Green')
          .setFooter({ text: '©️ InvitesCounter' })
          .setTimestamp(Date.now())

        return message.channel.send({ embeds: [embed] })
      }
    } else {
      const command = client.commands.get(args[0]) || client.aliases.get(args[0])
      if (!command) return message.channel.send(':x:')
      const embed = new EmbedBuilder()
        .setTitle(command.name)
        .setDescription(`**Command -** [ ${command.name} ]\n\n**Description -** [ \`${command.description[language === 'fr' ? 0 : 1]}\` ]\n\n**Usage -** [ \`${command.usage}\` ]\n\n**Aliases -** [ \`${command.aliases.join(', ') || '❌'}\` ]`)
        .setColor('Green')

      return message.channel.send({ embeds: [embed] })
    }
  }
})
