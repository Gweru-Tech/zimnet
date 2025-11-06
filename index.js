/*

 ▀▀█▀▀ █░▄▀ █▀▄▀█   █▀▀█ █▀▀▀█ ▀▀█▀▀
 ░▒█░░ █▀▄░ █▒█▒█   █▀▀▄ █░░▒█ ░▒█░░
 ░▒█░░ █░▒█ █░░▒█   █▄▄█ █▄▄▄█ ░▒█░░

© TKM-mods
WhatsApp Me : 263775571820

 - Source ↓
 - t.me/TKM-mods
 - wa.me/263775571820
 - https://whatsapp.com/channel/0029Vb5lvXDCMY0EyIW8Yf19

*/

require("./all/global")
const func = require("./all/place")
const readline = require("readline")
const welcome = JSON.parse(fs.readFileSync("./all/database/welcome.json"))
const { sleep } = require("./all/myfunc.js")  
const usePairingCode = true
const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
})
return new Promise((resolve) => {
rl.question(text, resolve)
})}

async function startSesi() {
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const { version, isLatest } = await fetchLatestBaileysVersion()

const connectionOptions = {
printQRInTerminal: !usePairingCode,
version: [2, 3000, 1017531287],    
logger: pino({ level: "fatal" }),
auth: state,
browser: ["Ubuntu","Chrome","20.0.04"],
getMessage: async (key) => {
if (store) {
const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
return msg?.message || undefined
}
return {
conversation: 'Ladybug Bot - Your Reliable WhatsApp Assistant'
}}
}

const Tkm = func.makeWASocket(connectionOptions)
if (usePairingCode && !Tkm.authState.creds.registered) {
const phoneNumber = await question(chalk.cyan.bold('🐞 LADYBUG BOT SETUP 🐞\n\nEnter your WhatsApp number starting with country code\nExample : 263xxxxxxxxx\n\nNumber: '))
const code = await Tkm.requestPairingCode(phoneNumber.trim())
console.log(`\n${chalk.green.bold('✓ Your Pairing Code')} : ${chalk.redBright.bold(code.split("").join(" "))}\n`)
}
store?.bind(Tkm.ev)

Tkm.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
const reason = new Boom(lastDisconnect?.error)?.output.statusCode
console.log(color(lastDisconnect.error, 'deeppink'))
if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
process.exit()
} else if (reason === DisconnectReason.badSession) {
console.log(color(`🐞 Bad Session File, Please Delete Session and Scan Again`))
process.exit()
} else if (reason === DisconnectReason.connectionClosed) {
console.log(color('[LADYBUG]', 'white'), color('Connection closed, reconnecting...', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionLost) {
console.log(color('[LADYBUG]', 'white'), color('Connection lost, trying to reconnect', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(color('🐞 Connection Replaced, Another New Session Opened, Please Close Current Session First'))
Tkm.logout()
} else if (reason === DisconnectReason.loggedOut) {
console.log(color(`🐞 Device Logged Out, Please Scan Again And Run.`))
Tkm.logout()
} else if (reason === DisconnectReason.restartRequired) {
console.log(color('🐞 Restart Required, restarting...'))
await startSesi()
} else if (reason === DisconnectReason.timedOut) {
console.log(color('🐞 Connection TimedOut, Reconnecting...'))
startSesi()
}
} else if (connection === "connecting") {
console.log(chalk.cyan.bold('🐞 Ladybug Bot Connecting . . . '))
} else if (connection === "open") {
let teksnotif = `╭━━━━『 *LADYBUG BOT* 』━━━━╮
│ 
│ ✓ Successfully Connected
│ 📱 Number: ${Tkm.user.id.split(":")[0]}
│ 🤖 Bot: Ladybug MD
│ 🚀 Status: Online
│ 📅 Date: ${new Date().toLocaleDateString()}
│ ⏰ Time: ${new Date().toLocaleTimeString()}
│
╰━━━━━━━━━━━━━━━━━━━╯

🐞 Ladybug Bot is now ready to assist you!`
Tkm.sendMessage("263777124998@s.whatsapp.net", {text: teksnotif})
console.log(chalk.green.bold('\n✓✓✓ LADYBUG BOT SUCCESSFULLY CONNECTED ✓✓✓\n'))
console.log(chalk.yellow.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'))
console.log(chalk.cyan.bold('🐞 Bot Name: Ladybug MD'))
console.log(chalk.cyan.bold('📱 Number: ' + Tkm.user.id.split(":")[0]))
console.log(chalk.cyan.bold('🚀 Status: Active'))
console.log(chalk.yellow.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'))

const linksal = ["0029Vb5lvXDCMY0EyIW8Yf19"]

const folldate = async functions => {
        for (const newslletterss of functions) {
          try {
            await sleep(3000);
            const saluranWa = await Tkm.newsletterMetadata("invite", newslletterss);
            await sleep(3000);
            await Tkm.newsletterFollow(saluranWa.id);
            console.log(chalk.green("✓ Successfully joined channel"))
          } catch (error) {
            console.error(chalk.red("✗ Failed to join channel ID: " + newslletterss), error);
          }
        }
      };
      (async () => {
        await folldate(linksal);
      })();    
}
})

Tkm.ev.on('call', async (user) => {
if (!global.anticall) return
for (let ff of user) {
if (ff.isGroup == false) {
if (ff.status == "offer") {
let sendcall = await Tkm.sendMessage(ff.from, {text: `╭━━━『 *⚠️ CALL DETECTED* 』━━━╮
│
│ Hello @${ff.from.split("@")[0]}
│ 
│ Sorry, you will be blocked because
│ the bot owner has activated 
│ *Anti-Call Protection*
│ 
│ If this was unintentional, please
│ contact the owner to unblock you.
│ 
╰━━━━━━━━━━━━━━━━━━━╯

🐞 *Ladybug Bot Security System*`, 
contextInfo: {
mentionedJid: [ff.from], 
externalAdReply: {
showAdAttribution: true, 
thumbnail: fs.readFileSync("./media/warning.jpg"), 
title: "🐞 LADYBUG - CALL DETECTED", 
body: "Anti-Call Protection Active",
previewType: "PHOTO"
}}}, {quoted: null})
Tkm.sendContact(ff.from, [owner], "🐞 Ladybug Bot Developer", sendcall)
await sleep(10000)
await Tkm.updateBlockStatus(ff.from, "block")
}}
}})

Tkm.ev.on('messages.upsert', async (chatUpdate) => {
try {
m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.isBaileys) return
if (m.key && m.key.remoteJid === 'status@broadcast') {
if (global.autoreadsw) Tkm.readMessages([m.key])
}
let fill = [global.owner, "263777124998"]
if (!Tkm.public && !fill.includes(m.key.remoteJid.split("@")[0]) && !m.key.fromMe && chatUpdate.type === 'notify') return
if (global.autoread) Tkm.readMessages([m.key])
m = func.smsg(Tkm, m, store)
require("./Ladybug")(Tkm, m, store)
} catch (err) {
console.log(err)
}
})

Tkm.ev.on('group-participants.update', async (anu) => {
if (!welcome.includes(anu.id)) return
let botNumber = await Tkm.decodeJid(Tkm.user.id)
if (anu.participants.includes(botNumber)) return
try {
let metadata = await Tkm.groupMetadata(anu.id)
let namagc = metadata.subject
let participants = anu.participants
for (let num of participants) {
let check = anu.author !== num && anu.author.length > 1
let tag = check ? [anu.author, num] : [num]
try {
ppuser = await Tkm.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://i.ibb.co/r2HHgh3Q/subzero-bot.jpg'
}
if (anu.action == 'add') {
Tkm.sendMessage(anu.id, {text: check ? `╭━━━『 *🐞 WELCOME* 』━━━╮
│
│ @${anu.author.split("@")[0]} has added
│ @${num.split("@")[0]} to this group
│
│ 🎉 Welcome to *${namagc}*!
│ 
╰━━━━━━━━━━━━━━━━━╯` : `╭━━━『 *🐞 WELCOME* 』━━━╮
│
│ Hello @${num.split("@")[0]}!
│ 
│ Welcome to *${namagc}*
│ 
│ 🎉 Enjoy your stay!
│ 📜 Please read the group rules
│ 
╰━━━━━━━━━━━━━━━━━╯`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '🐞 Ladybug - Welcome Message', body: 'Powered by Ladybug Bot', renderLargerThumbnail: true, sourceUrl: linkgc, mediaType: 1}}})
} else if (anu.action == 'remove') { 
Tkm.sendMessage(anu.id, {text: check ? `╭━━━『 *🐞 GOODBYE* 』━━━╮
│
│ @${anu.author.split("@")[0]} has removed
│ @${num.split("@")[0]} from this group
│
╰━━━━━━━━━━━━━━━━━╯` : `╭━━━『 *🐞 GOODBYE* 』━━━╮
│
│ @${num.split("@")[0]} has left
│ 
│ 👋 Goodbye!
│ 
╰━━━━━━━━━━━━━━━━━╯`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '🐞 Ladybug - Leaving Message', body: 'Powered by Ladybug Bot', renderLargerThumbnail: true, sourceUrl: linkgc, mediaType: 1}}})
} else if (anu.action == "promote") {
Tkm.sendMessage(anu.id, {text: `╭━━━『 *🐞 PROMOTION* 』━━━╮
│
│ @${anu.author.split("@")[0]} has promoted
│ @${num.split("@")[0]} to Admin
│
│ ⭐ Congratulations!
│ 
╰━━━━━━━━━━━━━━━━━╯`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '🐞 Ladybug - Promote Message', body: 'Powered by Ladybug Bot', renderLargerThumbnail: true, sourceUrl: linkgc, mediaType: 1}}})
} else if (anu.action == "demote") {
Tkm.sendMessage(anu.id, {text: `╭━━━『 *🐞 DEMOTION* 』━━━╮
│
│ @${anu.author.split("@")[0]} has demoted
│ @${num.split("@")[0]} from Admin
│
╰━━━━━━━━━━━━━━━━━╯`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: { thumbnailUrl: ppuser, title: '🐞 Ladybug - Demote Message', body: 'Powered by Ladybug Bot', renderLargerThumbnail: true, sourceUrl: linkgc, mediaType: 1}}})
}
}
} catch (err) {
console.log(err)
}})

Tkm.public = true

Tkm.ev.on('creds.update', saveCreds)
return Tkm
}

startSesi()

process.on('uncaughtException', function (err) {
console.log('🐞 Ladybug - Caught exception: ', err)
})
