/* eslint-disable no-undef */
import { EXTANDED_CLIENT } from '../../index.js'

export class Command {
  /**
   * @param {{
   * aliases: Array<>
   *  userPermissions: import("discord.js").PermissionResolvable,
    *  callback: Function
    * }
    */
  constructor (commandOptions = { aliases, userPermissions, callback }) {
    EXTANDED_CLIENT.commands.set(commandOptions.name, commandOptions)
    commandOptions.aliases.forEach(alias => EXTANDED_CLIENT.aliases.set(alias, commandOptions))
    if (commandOptions.aliases && commandOptions.aliases.length > 0) {
      commandOptions.aliases.map(alias => EXTANDED_CLIENT.aliases.set(alias, commandOptions))
    }
  }
}
