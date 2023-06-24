const fs = require('fs')

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync('./src/commands')
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith('.js'))
      const { commands, commandArray } = client
      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`)
        commands.set(command.data.name, command)
        commandArray.push(command, command.data.toJSON())
        //  console.log(`Command: ${command.data.name} loaded!`)
      }
    }
  }
}
