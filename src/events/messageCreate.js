/* eslint-disable no-useless-escape */
import { Evenement } from '../structures/evenements.js'
import Discord from 'discord.js'
import fs from 'fs'

export default new Evenement({
  eventName: { messageCreate: 0 },

  /**
     * @param { Discord.Message } message
     * @param {{ commands: Discord.Collection, events: Discord.Collection, aliases: Discord.Collection, config: Object } & Discord.Client} client
     */

  async callback (client, message) {
    if (!message.content.startsWith(client.config.clientPrefix) || message.author.bot) return

    const args = message.content.slice(1).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()
    if (!client.commands.has(commandName) && !client.aliases.has(commandName)) return

    const command = client.commands.get(commandName) || client.aliases.get(commandName)

    if (command.userPermissions !== 'EVERYONE' && !message.member.permissions.has(Discord.PermissionFlagsBits[command.userPermissions])) { return message.channel.send(`Vous n\'avez pas la permission requise pour utiliser cette commande\nPermission requise : \`${command.userPermissions}\``) }
    let language
    const langggg = await client.db.get(`lang_${message.guild.id}`)
    if (langggg === undefined || langggg === null) {
      await client.db.set(`lang_${message.guild.id}`, 'en')
      language = await client.db.get(`lang_${message.guild.id}`)
    }
    language = await client.db.get(`lang_${message.guild.id}`)
    const lang = JSON.parse(await fs.readFileSync(`./langs/${language}.json`, err => {
      if (err) {
        console.log(err)
      }
    }))
    try {
      command.callback(client, message, args, lang)
    } catch (error) {
      console.error(error)
      message.reply("Une erreur est survenue lors de l'exécution de cette commande.")
    }
  }
})
