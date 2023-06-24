require('dotenv').config()
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const fs = require('fs')
const path = require('path')
const client = new Client({ intents: GatewayIntentBits.Guilds })
client.commands = new Collection()
client.commandArray = []

fs.readdirSync('./src/handlers')
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => require(`./handlers/${file}`)(client))

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)
// console.log('Path is ' + foldersPath)
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.log(
        `The command at ${filePath} is missing a required "data" or "execute" property.`
      )
    }
  }
}
client.on(Events.interactionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return
  console.log(interaction)
})

client.handleEvents()
client.handleCommands()
client.login(process.env.DISCORD_BOT_TOKEN)
