require('dotenv').config()
const Airtable = require('airtable')
const { AIRTABLE_API, AIRTABLE_BASE } = process.env
const base = new Airtable({ apiKey: AIRTABLE_API }).base(AIRTABLE_BASE)
const { SlashCommandBuilder } = require('discord.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('team-up')
    .setDescription('Team up with other members!')
    .addStringOption((option) =>
      option
        .setName('teamname')
        .setDescription('Input team name')
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName('member-1')
        .setDescription('Input leader name (tagging discord)')
        .setRequired(true)
    )
    .addUserOption(
      (option) =>
        option
          .setName('member-2')
          .setDescription('Input member name (tagging discord)')
      // .setRequired(false)
    )
    .addUserOption(
      (option) =>
        option
          .setName('member-3')
          .setDescription('Input member name (tagging discord)')
      // .setRequired(true)
    )
    .addUserOption(
      (option) =>
        option
          .setName('member-4')
          .setDescription('Input member name (tagging discord)')
      // .setRequired(true)
    )
    .addUserOption(
      (option) =>
        option
          .setName('member-5')
          .setDescription('Input member name (tagging discord)')
      // .setRequired(true)
    )
    .addUserOption(
      (option) =>
        option
          .setName('member-6')
          .setDescription('Input member name (tagging discord)')
      // .setRequired(true)
    ),
  async execute(interaction) {
    const teamname = interaction.options.getString('teamname')
    const member1 = interaction.options.getUser('member-1')
    const member2 = interaction.options.getUser('member-2')
    const member3 = interaction.options.getUser('member-3')
    const member4 = interaction.options.getUser('member-4')
    const member5 = interaction.options.getUser('member-5')
    const member6 = interaction.options.getUser('member-6')
    console.log('Member 4 = ' + member4)
    const allfield = []
    if (member1) {
      allfield.push({
        Name: `${member1.username}`,
        Notes: 'Leader',
        Team: teamname,
      })
    }
    if (member2) {
      allfield.push({
        Name: `${member2.username}`,
        Notes: 'Member',
        Team: teamname,
      })
    }
    if (member3) {
      allfield.push({
        Name: `${member3.username}`,
        Notes: 'Member',
        Team: teamname,
      })
    }
    if (member4) {
      allfield.push({
        Name: `${member4.username}`,
        Notes: 'Member',
        Team: teamname,
      })
    }
    if (member5) {
      allfield.push({
        Name: `${member5.username}`,
        Notes: 'Member',
        Team: teamname,
      })
    }
    if (member6) {
      allfield.push({
        Name: `${member6.username}`,
        Notes: 'Member',
        Team: teamname,
      })
    }
    const fetchdata = []
    await new Promise((resolve, reject) => {
      base('Table 1')
        .select({
          maxRecords: 120,
          view: 'Grid view',
        })
        .eachPage(
          (records, next) => {
            records.forEach(async (record) => {
              fetchdata.push({ field: record.fields, id: record.getId() })
            })
            next()
          },
          (err) => {
            //Found error
            if (err) {
              reject(err)
              console.error(err)
              return
            }
            resolve(fetchdata)
            //Not found error
            fetchdata.forEach((record) => {
              console.log(record)
            })
          }
        )
    })
    let flag = false
    fetchdata.some((data) => {
      // console.log(
      //   ' ' +
      //     data.field.Name +
      //     ' and ' +
      //     member0.username
      // )
      if (data.field.Name == member1.username) {
        flag = true
        return true
      }
    })
    if (flag == true) {
      await interaction.reply(`⁉️ You already have a team.`)
    } else {
      allfield.forEach((field) => {
        base('Table 1').create(
          [
            {
              fields: field,
            },
          ],
          (err, records) => {
            if (err) {
              console.error(err)
              return
            }
            records.forEach((record) => {
              console.log(record.fields)
              // console.log(record)
            })
          }
        )
      })
      await interaction.reply(
        `**Success! 🎉**
🌟 Group Name : ${teamname}
👦 Members : ${member1} (Leader), ${member2} (Member) and more`
      )
    }

    // const leader = interaction.options.getUser('leader')
    // const member1 = interaction.options.getUser('member-1')
    // const member2 = interaction.options.getUser('member-2')
  },
}

// base('Table 1')
//   .select({ Name: 'Hello' })
//   .eachPage((records, next) => {
//     records.forEach((record) => {
//       // console.log(record.get('Name'))
//       console.log(record.fields)
//     })
//     next()
//   })
// base('Table 1').create(
//   [
//     {
//       fields: {
//         Name: 'Number 1',
//         Notes: 'This is a note',
//       },
//     },
//     {
//       fields: {
//         Name: 'Number 2',
//         Notes: 'SDFSDFSDFDSF',
//       },
//     },
//   ],
//   (err, records) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     records.forEach((record) => {
//       console.log(record.fields)
//       console.log(record)
//     })
//   }
// )
