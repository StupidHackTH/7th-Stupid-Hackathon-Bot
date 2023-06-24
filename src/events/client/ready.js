const { Events, ActivityType } = require('discord.js')
module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    await console.log(`Ready! Logged in as ${client.user.tag}`)
    setInterval(() => {
      const ping = client.ws.ping
      console.log(`Ping: ${ping} ms`)
      client.user.setActivity({
        name: `Ping: ${ping} ms`,
        type: ActivityType.WATCHING,
      })
    }, 4000)
  },
}
