/* eslint-disable no-unused-vars */
import {
  Message,
  Client,
  Collection
} from 'discord.js'
import {
  Command
} from '../structures/commands.js'
export default new Command({
  name: 'remove-invites',
  description: ['Affiche le nombre d\'invites d\'un membre', 'Displays the number of invites for the member'],
  category: 'util',
  usage: 'remove-invites <member> <number>',
  aliases: ['inv', 'i', 'invite'],
  userPermissions: 'Administrator',

  /**
           * @param { { commands: Collection, events: Collection, db: Database} & Client } client
           * @param { Message } message
           */

  async callback (client, message, args, lang) {
    const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
    const number = parseInt(args[1])
    if (!member) return message.reply(':x: ' + lang.invitesadd.invaliduser)
    if (!number || number === 0) return message.reply('⚠️ ' + lang.invitesadd.invalidnumber)
    const data = await client.db.get(`invites_${message.guild.id}_${member.id}`) || {
      total: 0,
      valid: 0,
      left: 0,
      bonus: 0
    }
    if (data.bonus === 0 || data.bonus === undefined || data.bonus === null) return message.reply({ content: `${lang.removeinvites.already0}` })
    if (data.bonus < number) return message.reply({ content: `${lang.removeinvites.numberinferior}` })
    await client.db.set(`invites_${message.guild.id}_${member.user.id}`, {
      total: data.total - number,
      valid: data.valid,
      left: data.left,
      bonus: data.bonus - number
    })
    return message.reply(`:white_check_mark: ${lang.removeinvites.success.replace('{number}', number).replace('{member}', member.user.username)}`)
  }
})
