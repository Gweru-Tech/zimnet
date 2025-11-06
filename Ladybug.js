require("./all/global")
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, getBinaryNodeChildren, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@whiskeysockets/baileys')
const fs = require('fs')
const util = require('util')
const chalk = require('chalk')
const { exec, spawn, execSync } = require("child_process")
const axios = require('axios')
const path = require('path')
const os = require('os')
const moment = require('moment-timezone')
const { JSDOM } = require('jsdom')
const { color, bgcolor } = require('./all/color')
const { smsg, tanggal, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins } = require('./all/myfunc')

// Emojis for reactions
const emojis = ['🐞', '❤️', '💚', '💛', '💙', '💜', '🔥', '⭐', '✨', '🌟', '👍', '😊', '🎉', '🚀']

module.exports = Tkm = async (Tkm, m, chatUpdate, store) => {
try {
var body = (m.mtype === 'conversation') ? m.message.conversation : 
(m.mtype == 'imageMessage') ? m.message.imageMessage.caption : 
(m.mtype == 'videoMessage') ? m.message.videoMessage.caption : 
(m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
(m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : 
(m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : 
(m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : 
(m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''

var budy = (typeof m.text == 'string' ? m.text : '')
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '.'
const isCmd = body.startsWith(prefix)
const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
const args = body.trim().split(/ +/).slice(1)
const pushname = m.pushName || "No Name"
const botNumber = await Tkm.decodeJid(Tkm.user.id)
const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
const itsMe = m.sender == botNumber ? true : false
const text = q = args.join(" ")
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const isMedia = /image|video|sticker|audio/.test(mime)
const from = m.key.remoteJid
const groupMetadata = m.isGroup ? await Tkm.groupMetadata(m.chat).catch(e => {}) : ''
const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
const groupName = m.isGroup ? groupMetadata.subject : ''
const participants = m.isGroup ? await groupMetadata.participants : ''
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
const isGroup = m.chat.endsWith('@g.us')
const groupOwner = m.isGroup ? groupMetadata.owner : ''
const isGroupOwner = m.isGroup ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender) : false

// Auto Read Messages
if (global.autoread) {
Tkm.readMessages([m.key])
}

// Auto Typing
if (global.autotyping && isCmd) {
await Tkm.sendPresenceUpdate('composing', from)
}

// Auto React
if (global.autoreact && isCmd) {
const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
await Tkm.sendMessage(from, {
react: {
text: randomEmoji,
key: m.key
}
})
}

// Console log
if (m.message) {
console.log(chalk.black(chalk.bgWhite('[ MESSAGE ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> From'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=> In'), chalk.green(m.isGroup ? pushname : 'Private Chat', m.chat))
}

// Reply function
const reply = (teks) => {
Tkm.sendMessage(from, { text: teks, contextInfo: {"externalAdReply": {"title": `🐞 Ladybug Bot`,"body": `Hi ${pushname}`, "previewType": "PHOTO","thumbnailUrl": ``,"thumbnail": fs.readFileSync(`./media/ladybug.jpg`),"sourceUrl": ``}}}, { quoted: m })
}

// Auto Reaction on receiving message (not just commands)
if (global.autoreact && !isCmd && !m.isBaileys) {
const autoReactEmoji = ['🐞', '👍', '❤️']
const selectedEmoji = autoReactEmoji[Math.floor(Math.random() * autoReactEmoji.length)]
await Tkm.sendMessage(from, {
react: {
text: selectedEmoji,
key: m.key
}
}).catch(e => {})
}

// Command Handler
switch(command) {
case 'menu':
case 'help': {
let menuText = `╭━━━『 *🐞 LADYBUG BOT* 』━━━╮
│
│ 👋 Hello, ${pushname}!
│ 
│ 📱 Bot Number: ${botNumber.split('@')[0]}
│ 🕐 Time: ${moment.tz('Africa/Harare').format('HH:mm:ss')}
│ 📅 Date: ${moment.tz('Africa/Harare').format('DD/MM/YYYY')}
│ ⏱️ Runtime: ${runtime(process.uptime())}
│
╰━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *MAIN MENU* 』━━━╮
│
│ • ${prefix}menu
│ • ${prefix}info
│ • ${prefix}owner
│ • ${prefix}script
│ • ${prefix}ping
│ • ${prefix}runtime
│
╰━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *GROUP MENU* 』━━━╮
│
│ • ${prefix}welcome
│ • ${prefix}tagall
│ • ${prefix}hidetag
│ • ${prefix}kick
│ • ${prefix}add
│ • ${prefix}promote
│ • ${prefix}demote
│ • ${prefix}linkgroup
│
╰━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *DOWNLOAD MENU* 』━━━╮
│
│ • ${prefix}play
│ • ${prefix}ytmp3
│ • ${prefix}ytmp4
│ • ${prefix}tiktok
│ • ${prefix}instagram
│ • ${prefix}facebook
│
╰━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *FUN MENU* 』━━━╮
│
│ • ${prefix}dare
│ • ${prefix}truth
│ • ${prefix}joke
│ • ${prefix}quote
│
╰━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *OWNER MENU* 』━━━╮
│
│ • ${prefix}self
│ • ${prefix}public
│ • ${prefix}join
│ • ${prefix}leave
│ • ${prefix}block
│ • ${prefix}unblock
│ • ${prefix}backup
│
╰━━━━━━━━━━━━━━━━━━━╯

🐞 *Ladybug Bot* - Your Reliable Assistant
Powered by NinjaBot Technology`

reply(menuText)
}
break

case 'info':
case 'botinfo': {
let infoText = `╭━━━『 *🐞 BOT INFO* 』━━━╮
│
│ 🤖 Bot Name: Ladybug MD
│ 👨‍💻 Creator: NinjaTech AI
│ 📱 Number: ${botNumber.split('@')[0]}
│ 🌐 Platform: WhatsApp
│ ⏱️ Runtime: ${runtime(process.uptime())}
│ 💾 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
│ 📊 OS: ${os.platform()}
│ ⚡ Speed: Fast & Reliable
│
│ ✨ Features:
│ • Auto Read ✓
│ • Auto Typing ✓
│ • Auto React ✓
│ • 24/7 Active ✓
│
╰━━━━━━━━━━━━━━━━━━━╯`
reply(infoText)
}
break

case 'ping':
case 'speed': {
const timestamp = require('performance-now')
const startTime = timestamp()
const pingMsg = await Tkm.sendMessage(from, { text: '🐞 Testing speed...' }, { quoted: m })
const endTime = timestamp()
const ping = (endTime - startTime).toFixed(2)
await Tkm.sendMessage(from, { 
text: `╭━━━『 *🐞 PING* 』━━━╮
│
│ ⚡ Speed: ${ping} ms
│ 📡 Status: Active
│ 🚀 Performance: Optimal
│
╰━━━━━━━━━━━━━━━━━━━╯`, 
edit: pingMsg.key 
})
}
break

case 'runtime':
case 'uptime': {
reply(`╭━━━『 *🐞 RUNTIME* 』━━━╮
│
│ ⏱️ Runtime: ${runtime(process.uptime())}
│ 📅 Started: ${moment(process.uptime() * 1000).format('DD/MM/YYYY')}
│ 🚀 Status: Online
│
╰━━━━━━━━━━━━━━━━━━━╯`)
}
break

case 'owner':
case 'creator': {
Tkm.sendContact(from, [owner], '🐞 Ladybug Bot Creator', m)
reply('👆 Above is the bot owner contact!')
}
break

case 'tagall': {
if (!m.isGroup) return reply('⚠️ This command can only be used in groups!')
if (!isAdmins && !isCreator) return reply('⚠️ This command is only for group admins!')
let teks = `╭━━━『 *📢 TAG ALL* 』━━━╮
│
│ 💬 Message: ${q ? q : 'No message'}
│
╰━━━━━━━━━━━━━━━━━━━╯\n\n`
for (let mem of participants) {
teks += `🐞 @${mem.id.split('@')[0]}\n`
}
Tkm.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m })
}
break

case 'hidetag': {
if (!m.isGroup) return reply('⚠️ This command can only be used in groups!')
if (!isAdmins && !isCreator) return reply('⚠️ This command is only for group admins!')
Tkm.sendMessage(from, { text: q ? q : '🐞 Ladybug notification!', mentions: participants.map(a => a.id) }, { quoted: m })
}
break

case 'self': {
if (!isCreator) return reply('⚠️ This command is only for the bot owner!')
Tkm.public = false
reply('✓ Bot is now in *Self Mode*')
}
break

case 'public': {
if (!isCreator) return reply('⚠️ This command is only for the bot owner!')
Tkm.public = true
reply('✓ Bot is now in *Public Mode*')
}
break

default:
if (budy.startsWith('=>')) {
if (!isCreator) return reply('⚠️ Owner only command!')
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return reply(bang)
}
try {
reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
reply(String(e))
}
}

if (budy.startsWith('>')) {
if (!isCreator) return reply('⚠️ Owner only command!')
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await reply(evaled)
} catch (err) {
await reply(String(err))
}
}

if (budy.startsWith('$')) {
if (!isCreator) return reply('⚠️ Owner only command!')
exec(budy.slice(2), (err, stdout) => {
if(err) return reply(err)
if (stdout) return reply(stdout)
})
}
}

} catch (err) {
console.log(util.format(err))
}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})
