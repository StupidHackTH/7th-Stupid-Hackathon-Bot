require('dotenv').config()
const Airtable = require('airtable')
const { AIRTABLE_API, AIRTABLE_BASE } = process.env
const base = new Airtable({ apiKey: AIRTABLE_API }).base(AIRTABLE_BASE)
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Please submit your group work here')
    .addStringOption((option) =>
      option
        .setName('teamname')
        .setDescription('Please input your team name')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription(
          'Please submit link that store all of your file (eg. Google Drive / Github)'
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const geturl = interaction.options.getString('url')
    const getteam = interaction.options.getString('teamname')
    const fetchteam = []
    await new Promise((resolve, reject) => {
      base('Table 2')
        .select({ maxRecords: 120, view: 'Grid view' })
        .eachPage(
          (records, next) => {
            records.forEach((record) => {
              fetchteam.push({ field: record.fields, id: record.getId() })
            })
            next()
          },
          (error) => {
            if (error) reject(error)
            resolve()
            fetchteam.forEach((record) => {
              console.log(record)
            })
          }
        )
    })
    let found = false
    fetchteam.some((data) => {
      if (getteam == data.field.Name) {
        found = true
        base('Table 2').update([
          {
            id: data.id,
            fields: {
              URL: geturl,
              Status: 'Submitted',
            },
          },
        ])
        console.log(`Updated`)
      }
    })
    if (found)
      await interaction.reply(`**🪄 Submit successful and congrats!**
🌟 Group Name: ${getteam}
📌 URL: ${geturl}`)
    else {
      interaction.reply(`**🚫 Incorrect teamname, try again**`)
    }
  },
}
