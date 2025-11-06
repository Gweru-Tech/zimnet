require("./all/global")
const func = require("./all/place")
const fs = require("fs")
const axios = require("axios")
const chalk = require("chalk")
const moment = require("moment-timezone")
const { exec } = require("child_process")
const speed = require("performance-now")

module.exports = async (Ladybug, m, store) => {
    try {
        const body = (m.mtype === 'conversation') ? m.message.conversation :
                     (m.mtype === 'imageMessage') ? m.message.imageMessage.caption :
                     (m.mtype === 'videoMessage') ? m.message.videoMessage.caption :
                     (m.mtype === 'extendedTextMessage') ? m.message.extendedTextMessage.text :
                     (m.mtype === 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :
                     (m.mtype === 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
                     (m.mtype === 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId :
                     (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''

        const budy = (typeof m.text === 'string' ? m.text : '')
        const prefix = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@*+,.?=''():√%¢£¥€π¤ΠΦ_&><!`™©®Δ^βα~¦|/\\©^]/gi) : '.'
        const isCmd = body.startsWith(prefix)
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
        const args = body.trim().split(/ +/).slice(1)
        const text = q = args.join(" ")
        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const isMedia = /image|video|sticker|audio/.test(mime)
        
        // Bot Info
        const botNumber = await Ladybug.decodeJid(Ladybug.user.id)
        const isOwner = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isGroup = m.key.remoteJid.endsWith('@g.us')
        const groupMetadata = isGroup ? await Ladybug.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const participants = isGroup ? await groupMetadata.participants : ''
        const groupAdmins = isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
        const groupOwner = isGroup ? groupMetadata.owner : ''
        const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false
        
        // Push Messages to Console
        if (m.message) {
            console.log(chalk.black(chalk.bgWhite('[ MESSAGE ]')),
                chalk.black(chalk.bgGreen(new Date().toLocaleString())),
                chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' +
                chalk.magenta('=> From'),
                chalk.green(m.pushName),
                chalk.yellow(m.sender) + '\n' +
                chalk.blueBright('=> In'),
                chalk.green(isGroup ? m.pushName : 'Private Chat', m.chat))
        }

        // Response Function
        const reply = (teks) => {
            Ladybug.sendMessage(m.chat, { text: teks }, { quoted: m })
        }

        // Auto Read & Presence Update
        if (global.autoread) {
            Ladybug.readMessages([m.key])
        }

        // ===================== COMMANDS =====================

        switch (command) {
            
            // ========== GENERAL COMMANDS ==========
            
            case 'menu':
            case 'help':
            case 'commands': {
                let menuText = `
╭━━━━『 *LADYBUG BOT* 』━━━━┈ ⳹
│ 🐞 *Bot Name:* Ladybug MD
│ 👤 *Owner:* ${global.owner}
│ ⏰ *Time:* ${moment.tz('Africa/Harare').format('HH:mm:ss')}
│ 📅 *Date:* ${moment.tz('Africa/Harare').format('DD/MM/YYYY')}
│ 👥 *Users:* ${Object.keys(global.db.data.users).length}
│ 🤖 *Prefix:* [ ${prefix} ]
╰━━━━━━━━━━━━━━━━━━┈ ⳹

╭━━━『 *GENERAL* 』━━━┈ ⳹
│ • ${prefix}menu
│ • ${prefix}alive
│ • ${prefix}ping
│ • ${prefix}runtime
│ • ${prefix}speed
│ • ${prefix}owner
│ • ${prefix}script
│ • ${prefix}donate
╰━━━━━━━━━━━━━━━┈ ⳹

╭━━━『 *OWNER* 』━━━┈ ⳹
│ • ${prefix}join [link]
│ • ${prefix}leave
│ • ${prefix}block [user]
│ • ${prefix}unblock [user]
│ • ${prefix}setpp [reply image]
│ • ${prefix}setname [text]
│ • ${prefix}setstatus [text]
│ • ${prefix}broadcast [text]
│ • ${prefix}eval [code]
│ • ${prefix}exec [terminal]
╰━━━━━━━━━━━━━━━┈ ⳹

╭━━━『 *GROUP* 』━━━┈ ⳹
│ • ${prefix}welcome [on/off]
│ • ${prefix}antilink [on/off]
│ • ${prefix}promote [@user]
│ • ${prefix}demote [@user]
│ • ${prefix}kick [@user]
│ • ${prefix}add [number]
│ • ${prefix}tagall [text]
│ • ${prefix}hidetag [text]
│ • ${prefix}group [open/close]
│ • ${prefix}setppgroup [reply img]
│ • ${prefix}setname [text]
│ • ${prefix}setdesc [text]
╰━━━━━━━━━━━━━━━┈ ⳹

╭━━━『 *DOWNLOAD* 』━━━┈ ⳹
│ • ${prefix}play [song name]
│ • ${prefix}ytmp3 [url]
│ • ${prefix}ytmp4 [url]
│ • ${prefix}tiktok [url]
│ • ${prefix}instagram [url]
│ • ${prefix}facebook [url]
│ • ${prefix}twitter [url]
╰━━━━━━━━━━━━━━━┈ ⳹

╭━━━『 *SEARCH* 』━━━┈ ⳹
│ • ${prefix}google [query]
│ • ${prefix}ytsearch [query]
│ • ${prefix}lyrics [song]
│ • ${prefix}weather [city]
│ • ${prefix}wikipedia [query]
│ • ${prefix}image [query]
╰━━━━━━━━━━━━━━━┈ ⳹

╭━━━『 *FUN* 』━━━┈ ⳹
│ • ${prefix}joke
│ • ${prefix}quote
│ • ${prefix}truth
│ • ${prefix}dare
│ • ${prefix}fact
│ • ${prefix}meme
╰━━━━━━━━━━━━━━━┈ ⳹

╭━━━『 *TOOLS* 』━━━┈ ⳹
│ • ${prefix}sticker [reply img/vid]
│ • ${prefix}toimage [reply sticker]
│ • ${prefix}tovideo [reply sticker]
│ • ${prefix}toaudio [reply video]
│ • ${prefix}tomp3 [reply video]
│ • ${prefix}translate [lang] [text]
│ • ${prefix}tts [lang] [text]
╰━━━━━━━━━━━━━━━┈ ⳹

🐞 *Ladybug Bot* - WhatsApp Bot 2025
`
                await Ladybug.sendMessage(m.chat, {
                    image: { url: 'https://i.ibb.co/0BZfPq6/ladybug.jpg' },
                    caption: menuText,
                    footer: '© Ladybug Bot 2025',
                    buttons: [
                        { buttonId: prefix + 'owner', buttonText: { displayText: '👤 Owner' }, type: 1 },
                        { buttonId: prefix + 'script', buttonText: { displayText: '📜 Script' }, type: 1 },
                        { buttonId: prefix + 'donate', buttonText: { displayText: '💰 Donate' }, type: 1 }
                    ],
                    headerType: 4
                }, { quoted: m })
            }
            break

            case 'alive':
            case 'bot': {
                const start = speed()
                const end = speed()
                const latency = (end - start).toFixed(4)
                
                reply(`🐞 *LADYBUG BOT IS ALIVE!*

✓ Speed: ${latency}ms
✓ Runtime: ${func.runtime(process.uptime())}
✓ Status: Active
✓ Mode: ${Ladybug.public ? 'Public' : 'Self'}

_Bot is running smoothly!_`)
            }
            break

            case 'ping':
            case 'speed': {
                const start = speed()
                const end = speed()
                const latency = (end - start).toFixed(4)
                reply(`🏓 Pong!\n\n⚡ Speed: ${latency}ms`)
            }
            break

            case 'runtime':
            case 'uptime': {
                reply(`🤖 *Bot Runtime*\n\n⏰ ${func.runtime(process.uptime())}`)
            }
            break

            case 'owner':
            case 'creator': {
                await Ladybug.sendContact(m.chat, [global.owner], m)
                reply(`👤 *Bot Owner*\n\n📞 Contact the owner for support or inquiries.`)
            }
            break

            // ========== OWNER COMMANDS ==========

            case 'join': {
                if (!isOwner) return reply('❌ This command is only for the bot owner!')
                if (!text) return reply('❌ Please provide a group link!\n\nExample: ' + prefix + 'join https://chat.whatsapp.com/xxxxx')
                
                try {
                    let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
                    let [_, code] = text.match(linkRegex) || []
                    if (!code) return reply('❌ Invalid group link!')
                    
                    let res = await Ladybug.groupAcceptInvite(code)
                    reply('✅ Successfully joined the group!')
                } catch (e) {
                    console.log(e)
                    reply('❌ Failed to join the group!\n\n' + e.message)
                }
            }
            break

            case 'leave': {
                if (!isOwner) return reply('❌ This command is only for the bot owner!')
                if (!isGroup) return reply('❌ This command can only be used in groups!')
                
                await reply('👋 Goodbye! The bot is leaving this group.')
                await Ladybug.groupLeave(m.chat)
            }
            break

            case 'block': {
                if (!isOwner) return reply('❌ This command is only for the bot owner!')
                
                let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await Ladybug.updateBlockStatus(users, 'block')
                reply(`✅ Successfully blocked ${users.split('@')[0]}`)
            }
            break

            case 'unblock': {
                if (!isOwner) return reply('❌ This command is only for the bot owner!')
                
                let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await Ladybug.updateBlockStatus(users, 'unblock')
                reply(`✅ Successfully unblocked ${users.split('@')[0]}`)
            }
            break

            case 'setppbot':
            case 'setpp': {
                if (!isOwner) return reply('❌ This command is only for the bot owner!')
                if (!quoted) return reply('❌ Reply to an image!')
                if (!/image/.test(mime)) return reply('❌ Reply to an image!')
                
                try {
                    let media = await Ladybug.downloadAndSaveMediaMessage(quoted)
                    await Ladybug.updateProfilePicture(botNumber, { url: media })
                    fs.unlinkSync(media)
                    reply('✅ Profile picture updated successfully!')
                } catch (e) {
                    console.log(e)
                    reply('❌ Failed to update profile picture!')
                }
            }
            break

            case 'broadcast':
            case 'bc': {
                if (!isOwner) return reply('❌ This command is only for the bot owner!')
                if (!text) return reply('❌ Please provide a message to broadcast!\n\nExample: ' + prefix + 'broadcast Hello everyone!')
                
                let getGroups = await Ladybug.groupFetchAllParticipating()
                let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
                let anu = groups.map(v => v.id)
                
                reply(`📢 Broadcasting to ${anu.length} groups...`)
                
                for (let i of anu) {
                    await func.sleep(1500)
                    let txt = `*「 BROADCAST MESSAGE 」*\n\n${text}\n\n_This is a broadcast message from the bot owner._`
                    await Ladybug.sendMessage(i, { text: txt })
                }
                
                reply('✅ Broadcast sent successfully!')
            }
            break

            case 'eval': {
                if (!isOwner) return reply('❌ This command is only for the bot owner!')
                if (!text) return reply('❌ Please provide code to evaluate!')
                
                try {
                    let evaled = await eval(text)
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                    reply(evaled)
                } catch (err) {
                    reply(String(err))
                }
            }
            break

            case 'exec': {
                if (!isOwner) return reply('❌ This command is only for the bot owner!')
                if (!text) return reply('❌ Please provide a command to execute!')
                
                exec(text, (err, stdout) => {
                    if (err) return reply(err.toString())
                    if (stdout) return reply(stdout.toString())
                })
            }
            break

            // ========== GROUP COMMANDS ==========

            case 'welcome': {
                if (!isGroup) return reply('❌ This command can only be used in groups!')
                if (!isAdmins && !isOwner) return reply('❌ This command is only for group admins!')
                
                let welcome = JSON.parse(fs.readFileSync('./all/database/welcome.json'))
                
                if (args[0] === 'on') {
                    if (welcome.includes(m.chat)) return reply('✅ Welcome is already enabled!')
                    welcome.push(m.chat)
                    fs.writeFileSync('./all/database/welcome.json', JSON.stringify(welcome, null, 2))
                    reply('✅ Welcome feature enabled!')
                } else if (args[0] === 'off') {
                    if (!welcome.includes(m.chat)) return reply('❌ Welcome is already disabled!')
                    let off = welcome.indexOf(m.chat)
                    welcome.splice(off, 1)
                    fs.writeFileSync('./all/database/welcome.json', JSON.stringify(welcome, null, 2))
                    reply('✅ Welcome feature disabled!')
                } else {
                    reply(`❌ Usage: ${prefix}welcome on/off`)
                }
            }
            break

            case 'promote': {
                if (!isGroup) return reply('❌ This command can only be used in groups!')
                if (!isAdmins && !isOwner) return reply('❌ This command is only for group admins!')
                if (!isBotAdmins) return reply('❌ Bot needs to be admin to use this command!')
                
                let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await Ladybug.groupParticipantsUpdate(m.chat, [users], 'promote')
                reply(`✅ Successfully promoted @${users.split('@')[0]}`)
            }
            break

            case 'demote': {
                if (!isGroup) return reply('❌ This command can only be used in groups!')
                if (!isAdmins && !isOwner) return reply('❌ This command is only for group admins!')
                if (!isBotAdmins) return reply('❌ Bot needs to be admin to use this command!')
                
                let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await Ladybug.groupParticipantsUpdate(m.chat, [users], 'demote')
                reply(`✅ Successfully demoted @${users.split('@')[0]}`)
            }
            break

            case 'kick': {
                if (!isGroup) return reply('❌ This command can only be used in groups!')
                if (!isAdmins && !isOwner) return reply('❌ This command is only for group admins!')
                if (!isBotAdmins) return reply('❌ Bot needs to be admin to use this command!')
                
                let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await Ladybug.groupParticipantsUpdate(m.chat, [users], 'remove')
                reply(`✅ Successfully kicked @${users.split('@')[0]}`)
            }
            break

            case 'add': {
                if (!isGroup) return reply('❌ This command can only be used in groups!')
                if (!isAdmins && !isOwner) return reply('❌ This command is only for group admins!')
                if (!isBotAdmins) return reply('❌ Bot needs to be admin to use this command!')
                if (!text) return reply('❌ Please provide a number!\n\nExample: ' + prefix + 'add 263777123456')
                
                let users = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await Ladybug.groupParticipantsUpdate(m.chat, [users], 'add')
                reply(`✅ Successfully added ${text}`)
            }
            break

            case 'tagall': {
                if (!isGroup) return reply('❌ This command can only be used in groups!')
                if (!isAdmins && !isOwner) return reply('❌ This command is only for group admins!')
                
                let teks = `*「 TAG ALL 」*\n\n${text ? text : 'No message'}\n\n`
                for (let mem of participants) {
                    teks += `» @${mem.id.split('@')[0]}\n`
                }
                Ladybug.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m })
            }
            break

            case 'hidetag': {
                if (!isGroup) return reply('❌ This command can only be used in groups!')
                if (!isAdmins && !isOwner) return reply('❌ This command is only for group admins!')
                
                Ladybug.sendMessage(m.chat, { text: text ? text : '', mentions: participants.map(a => a.id) }, { quoted: m })
            }
            break

            case 'group': {
                if (!isGroup) return reply('❌ This command can only be used in groups!')
                if (!isAdmins && !isOwner) return reply('❌ This command is only for group admins!')
                if (!isBotAdmins) return reply('❌ Bot needs to be admin to use this command!')
                
                if (args[0] === 'close') {
                    await Ladybug.groupSettingUpdate(m.chat, 'announcement')
                    reply('✅ Group successfully closed!')
                } else if (args[0] === 'open') {
                    await Ladybug.groupSettingUpdate(m.chat, 'not_announcement')
                    reply('✅ Group successfully opened!')
                } else {
                    reply(`❌ Usage: ${prefix}group open/close`)
                }
            }
            break

            // ========== STICKER COMMANDS ==========

            case 'sticker':
            case 's': {
                if (!quoted) return reply('❌ Reply to an image or video!')
                if (/image/.test(mime)) {
                    let media = await quoted.download()
                    let encmedia = await Ladybug.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
                } else if (/video/.test(mime)) {
                    if ((quoted.msg || quoted).seconds > 11) return reply('❌ Maximum 10 seconds video!')
                    let media = await quoted.download()
                    let encmedia = await Ladybug.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
                } else {
                    reply('❌ Reply to an image or video!')
                }
            }
            break

            // ========== DEFAULT ==========

            default:
                // If no command matches
                if (isCmd && budy.startsWith(prefix)) {
                    reply(`❌ Command not found!\n\nType *${prefix}menu* to see available commands.`)
                }
        }

    } catch (err) {
        console.log(chalk.red('Error in Ladybug.js:'), err)
        m.reply('❌ An error occurred while processing your command!')
    }
}
