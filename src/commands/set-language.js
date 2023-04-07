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
  name: 'set-language',
  description: ['Modifier la langue du bot', 'Modify bot language'],
  category: 'admin',
  usage: 'set-language <fr/en>',
  aliases: ['set-lang', 'lang'],
  userPermissions: 'Administrator',

  /**
     * @param { { commands: Collection, events: Collection, db: Database} & Client } client
     * @param { Message } message
     */

  async callback (client, message, args) {
    const language = await client.db.get(`lang_${message.guild.id}`)
    if (!args[0]) return
    if (args[0] === 'fr' && language === 'fr') {
      return message.channel.send('La langue du bot est déjà en français.')
    } else if (args[0] === 'fr' && language !== 'fr') {
      await client.db.set(`lang_${message.guild.id}`, 'fr')
      return message.channel.send(':white_check_mark: Vous avez changé la langue du serveur en Français !')
    }
    if (args[0] === 'en' && language === 'en') {
      return message.channel.send('The language of the bot is already in English.')
    } else if (args[0] === 'en' && language !== 'en') {
      await client.db.set(`lang_${message.guild.id}`, 'en')
      return message.channel.send(':white_check_mark: You have set the language of this server to English !')
    }
  }
})
