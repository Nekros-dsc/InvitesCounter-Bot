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
  name: 'add-invites',
  description: ['Ajoute des invitations à un membre', 'Adds invitations to a member'],
  category: 'util',
  usage: 'add-invites <member> <number>',
  aliases: ['add-inv', 'add-i', 'add-invite'],
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
    await client.db.set(`invites_${message.guild.id}_${member.user.id}`, {
      total: data.total + number,
      valid: data.valid,
      left: data.left,
      bonus: data.bonus + number
    })
    return message.reply(`:white_check_mark: ${lang.invitesadd.success.replace('{number}', number).replace('{member}', member.user.username)}`)
  }
})