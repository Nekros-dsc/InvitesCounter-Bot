/* eslint-disable no-unused-vars */
import {
  EmbedBuilder,
  Message,
  Client,
  Collection,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} from 'discord.js'
import {
  Command
} from '../structures/commands.js'
export default new Command({
  name: 'invite-config',
  description: ['Configurer le bot', 'Setup the bot'],
  usage: 'invite-config',
  category: 'admin',
  aliases: ['jconfig', 'iconfig'],
  userPermissions: 'Administrator',

  /**
     * @param { { commands: Collection, events: Collection, db: Database} & Client } client
     * @param { Message } message
     */

  async callback (client, message, args, lang) {
    const data = await client.db.get(`invitesconfig.${message.guild.id}`)
    const description = lang.inviteconfig.embeddescription
      .replace('{guildname}', message.guild.name)
      .replace('{welcomelounge}', data?.welcomelounge ? `<#${data?.welcomelounge}>` : lang.inviteconfig.undefined)
      .replace('{welcomemsg}', data?.welcomemsg ? `${data?.welcomemsg}` : lang.inviteconfig.undefined)
      .replace('{goodbyelounge}', data?.goodbyelounge ? `<#${data?.goodbyelounge}>` : lang.inviteconfig.undefined)
      .replace('{goodbyemsg}', data?.goodbyemsg ? `${data?.goodbyemsg}` : lang.inviteconfig.undefined)
    const embed = new EmbedBuilder()
      .setDescription(`${description.toString()}`)
      .setColor('Green')
      .setFooter({ iconURL: client.user.avatarURL(), text: `+ InvitesCounter | ${lang.inviteconfig.requestedby} ${message.author.username}` })

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('bvnchannel')
          .setStyle(ButtonStyle.Success)
          .setLabel(lang.inviteconfig.welcomelounge),

        new ButtonBuilder()
          .setCustomId('bvnmsg')
          .setStyle(ButtonStyle.Success)
          .setLabel(lang.inviteconfig.welcomemsg)
      )

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('leavechannel')
          .setStyle(ButtonStyle.Danger)
          .setLabel(lang.inviteconfig.goodbyelounge),

        new ButtonBuilder()
          .setCustomId('leavemsg')
          .setStyle(ButtonStyle.Danger)
          .setLabel(lang.inviteconfig.goodbyemsg)
      )

    const msg = await message.reply({ embeds: [embed], components: [row, row2], fetchReply: true })
    const collector = msg.channel.createMessageComponentCollector({
      componentType: ComponentType.Button
    })

    collector.on('collect', async c => {
      if (c.customId === 'bvnmsg') {
        if (c.user.id !== message.author.id) return
        await c.reply({ content: lang.inviteconfig.askwelcomemsg, fetchReply: true }).then(ms => {
          ms.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1 }).then(async cl => {
            ms.delete()
            cl.first().delete()
            const data = await client.db.get(`invitesconfig.${message.guild.id}`)
            await client.db.set(`invitesconfig.${message.guild.id}`, {
              welcomemsg: cl.first().content,
              welcomelounge: data?.welcomelounge ? data?.welcomelounge : undefined,
              goodbyelounge: data?.goodbyelounge ? data?.goodbyelounge : undefined,
              goodbyemsg: data?.goodbyemsg ? data?.goodbyemsg : undefined
            })
            const dataafterupdate = await client.db.get(`invitesconfig.${message.guild.id}`)
            const embedd = new EmbedBuilder()
              .setDescription(lang.inviteconfig.embeddescription
                .replace('{guildname}', message.guild.name)
                .replace('{welcomelounge}', dataafterupdate.welcomelounge ? `<#${dataafterupdate.welcomelounge}>` : lang.inviteconfig.undefined)
                .replace('{welcomemsg}', dataafterupdate.welcomemsg ? `${dataafterupdate.welcomemsg}` : lang.inviteconfig.undefined)
                .replace('{goodbyelounge}', dataafterupdate.goodbyelounge ? `<#${dataafterupdate.goodbyelounge}>` : lang.inviteconfig.undefined)
                .replace('{goodbyemsg}', dataafterupdate.goodbyemsg ? `${dataafterupdate.goodbyemsg}` : lang.inviteconfig.undefined))
              .setColor('Green')
              .setFooter({ iconURL: client.user.avatarURL(), text: `+ InvitesCounter | ${lang.inviteconfig.requestedby} ${message.author.username}` })

            const row = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('bvnchannel')
                  .setStyle(ButtonStyle.Success)
                  .setLabel(lang.inviteconfig.welcomelounge),

                new ButtonBuilder()
                  .setCustomId('bvnmsg')
                  .setStyle(ButtonStyle.Success)
                  .setLabel(lang.inviteconfig.welcomemsg)
              )

            const row2 = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('leavechannel')
                  .setStyle(ButtonStyle.Danger)
                  .setLabel(lang.inviteconfig.goodbyelounge),

                new ButtonBuilder()
                  .setCustomId('leavemsg')
                  .setStyle(ButtonStyle.Danger)
                  .setLabel(lang.inviteconfig.goodbyemsg)
              )
            await msg.edit({ embeds: [embedd], components: [row, row2] })
          })
        })
      }
      if (c.customId === 'bvnchannel') {
        if (c.user.id !== message.author.id) return
        await c.reply({ content: lang.inviteconfig.askwelcomelounge, fetchReply: true }).then(ms => {
          ms.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1 }).then(async cl => {
            ms.delete()
            cl.first().delete()
            const ch = cl.first().mentions.channels.first() || ms.guild.channels.cache.get(cl.first().content)
            if (!ch) return ms.channel.send(':x:')
            const data = await client.db.get(`invitesconfig.${message.guild.id}`)
            await client.db.set(`invitesconfig.${message.guild.id}`, {
              welcomemsg: data?.welcomemsg ? data?.welcomemsg : undefined,
              welcomelounge: ch.id,
              goodbyelounge: data?.goodbyelounge ? data?.goodbyelounge : undefined,
              goodbyemsg: data?.goodbyemsg ? data?.goodbyemsg : undefined
            })
            const dataafterupdate = await client.db.get(`invitesconfig.${message.guild.id}`)
            const embedd = new EmbedBuilder()

              .setDescription(lang.inviteconfig.embeddescription
                .replace('{guildname}', message.guild.name)
                .replace('{welcomelounge}', dataafterupdate.welcomelounge ? `<#${dataafterupdate.welcomelounge}>` : lang.inviteconfig.undefined)
                .replace('{welcomemsg}', dataafterupdate.welcomemsg ? `${dataafterupdate.welcomemsg}` : lang.inviteconfig.undefined)
                .replace('{goodbyelounge}', dataafterupdate.goodbyelounge ? `<#${dataafterupdate.goodbyelounge}>` : lang.inviteconfig.undefined)
                .replace('{goodbyemsg}', dataafterupdate.goodbyemsg ? `${dataafterupdate.goodbyemsg}` : lang.inviteconfig.undefined))
              .setColor('Green')
              .setFooter({ iconURL: client.user.avatarURL(), text: `+ InvitesCounter | ${lang.inviteconfig.requestedby} ${message.author.username}` })

            const row = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('bvnchannel')
                  .setStyle(ButtonStyle.Success)
                  .setLabel(lang.inviteconfig.welcomelounge),

                new ButtonBuilder()
                  .setCustomId('bvnmsg')
                  .setStyle(ButtonStyle.Success)
                  .setLabel(lang.inviteconfig.welcomemsg)
              )

            const row2 = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('leavechannel')
                  .setStyle(ButtonStyle.Danger)
                  .setLabel(lang.inviteconfig.goodbyelounge),

                new ButtonBuilder()
                  .setCustomId('leavemsg')
                  .setStyle(ButtonStyle.Danger)
                  .setLabel(lang.inviteconfig.goodbyemsg)
              )
            await msg.edit({ embeds: [embedd], components: [row, row2] })
          })
        })
      }
      if (c.customId === 'leavechannel') {
        if (c.user.id !== message.author.id) return
        await c.reply({ content: lang.inviteconfig.askgoodbyelounge, fetchReply: true }).then(ms => {
          ms.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1 }).then(async cl => {
            ms.delete()
            cl.first().delete()
            const ch = cl.first().mentions.channels.first() || ms.guild.channels.cache.get(cl.first().content)
            if (!ch) return ms.channel.send(':x:')
            const data = await client.db.get(`invitesconfig.${message.guild.id}`)
            await client.db.set(`invitesconfig.${message.guild.id}`, {
              welcomemsg: data?.welcomemsg ? data?.welcomemsg : undefined,
              welcomelounge: data?.welcomelounge ? data?.welcomelounge : undefined,
              goodbyelounge: ch.id,
              goodbyemsg: data?.goodbyemsg ? data?.goodbyemsg : undefined
            })
            const dataafterupdate = await client.db.get(`invitesconfig.${message.guild.id}`)
            const embedd = new EmbedBuilder()

              .setDescription(lang.inviteconfig.embeddescription
                .replace('{guildname}', message.guild.name)
                .replace('{welcomelounge}', dataafterupdate.welcomelounge ? `<#${dataafterupdate.welcomelounge}>` : lang.inviteconfig.undefined)
                .replace('{welcomemsg}', dataafterupdate.welcomemsg ? `${dataafterupdate.welcomemsg}` : lang.inviteconfig.undefined)
                .replace('{goodbyelounge}', dataafterupdate.goodbyelounge ? `<#${dataafterupdate.goodbyelounge}>` : lang.inviteconfig.undefined)
                .replace('{goodbyemsg}', dataafterupdate.goodbyemsg ? `${dataafterupdate.goodbyemsg}` : lang.inviteconfig.undefined))
              .setColor('Green')
              .setFooter({ iconURL: client.user.avatarURL(), text: `+ InvitesCounter | ${lang.inviteconfig.requestedby} ${message.author.username}` })

            const row = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('bvnchannel')
                  .setStyle(ButtonStyle.Success)
                  .setLabel(lang.inviteconfig.welcomelounge),

                new ButtonBuilder()
                  .setCustomId('bvnmsg')
                  .setStyle(ButtonStyle.Success)
                  .setLabel(lang.inviteconfig.welcomemsg)
              )

            const row2 = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('leavechannel')
                  .setStyle(ButtonStyle.Danger)
                  .setLabel(lang.inviteconfig.goodbyelounge),

                new ButtonBuilder()
                  .setCustomId('leavemsg')
                  .setStyle(ButtonStyle.Danger)
                  .setLabel(lang.inviteconfig.goodbyemsg)
              )
            await msg.edit({ embeds: [embedd], components: [row, row2] })
          })
        })
      }
      if (c.customId === 'leavemsg') {
        if (c.user.id !== message.author.id) return
        await c.reply({ content: lang.inviteconfig.askgoodbyemsg, fetchReply: true }).then(ms => {
          ms.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1 }).then(async cl => {
            ms.delete()
            cl.first().delete()
            const data = await client.db.get(`invitesconfig.${message.guild.id}`)
            await client.db.set(`invitesconfig.${message.guild.id}`, {
              welcomemsg: data?.welcomemsg ? data?.welcomemsg : undefined,
              welcomelounge: data?.welcomelounge ? data?.welcomelounge : undefined,
              goodbyelounge: data?.goodbyelounge ? data?.goodbyelounge : undefined,
              goodbyemsg: cl.first().content
            })
            const dataafterupdate = await client.db.get(`invitesconfig.${message.guild.id}`)
            const embedd = new EmbedBuilder()

              .setDescription(lang.inviteconfig.embeddescription
                .replace('{guildname}', message.guild.name)
                .replace('{welcomelounge}', dataafterupdate.welcomelounge ? `<#${dataafterupdate.welcomelounge}>` : lang.inviteconfig.undefined)
                .replace('{welcomemsg}', dataafterupdate.welcomemsg ? `${dataafterupdate.welcomemsg}` : lang.inviteconfig.undefined)
                .replace('{goodbyelounge}', dataafterupdate.goodbyelounge ? `<#${dataafterupdate.goodbyelounge}>` : lang.inviteconfig.undefined)
                .replace('{goodbyemsg}', dataafterupdate.goodbyemsg ? `${dataafterupdate.goodbyemsg}` : lang.inviteconfig.undefined))
              .setColor('Green')
              .setFooter({ iconURL: client.user.avatarURL(), text: `+ InvitesCounter | ${lang.inviteconfig.requestedby} ${message.author.username}` })

            const row = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('bvnchannel')
                  .setStyle(ButtonStyle.Success)
                  .setLabel(lang.inviteconfig.welcomelounge),

                new ButtonBuilder()
                  .setCustomId('bvnmsg')
                  .setStyle(ButtonStyle.Success)
                  .setLabel(lang.inviteconfig.welcomemsg)
              )

            const row2 = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('leavechannel')
                  .setStyle(ButtonStyle.Danger)
                  .setLabel(lang.inviteconfig.goodbyelounge),

                new ButtonBuilder()
                  .setCustomId('leavemsg')
                  .setStyle(ButtonStyle.Danger)
                  .setLabel(lang.inviteconfig.goodbyemsg)
              )
            await msg.edit({ embeds: [embedd], components: [row, row2] })
          })
        })
      }
    })
  }
})
