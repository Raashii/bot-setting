/* Copyright (C) 2021 @Raashii
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

*/

const Rashi = require('../events');
const { MessageType, GroupSettingChange, Mimetype, MessageOptions } = require('@adiwajshing/baileys');
const fs = require('fs');
const config = require('../config')
const Config = require('../config')
const zara = require('../zara')
const axios = require('axios')
const request = require('request');
const os = require('os');

let wk = Config.WORKTYPE == 'public' ? false : true

var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]

var wish = ''

var eva = ''

var auto_bio = ''

var language = ''

var ase = new Date();

var jamss = ase.getHours();
if (jamss == 0) wish = '*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*'
if (jamss == 1) wish = '*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*'
if (jamss == 2) wish = '*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*'
if (jamss == 3) wish = '*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*'
if (jamss == 4) wish = '*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*'
if (jamss == 5) wish = '*ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ ⛅*'
if (jamss == 6) wish = '*ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ ⛅*'
if (jamss == 7) wish = '*ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ ⛅*'
if (jamss == 8) wish = '*ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ ⛅*'
if (jamss == 9) wish = '*ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ ⛅*'
if (jamss == 10) wish = '*ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ ⛅*'
if (jamss == 11) wish = '*ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ ⛅*'
if (jamss == 12) wish = '*ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ 🌞*'
if (jamss == 13) wish = '*ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ 🌞*'
if (jamss == 14) wish = '*ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ 🌞*'
if (jamss == 15) wish = '*ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ 🌞*'
if (jamss == 16) wish = '*ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ 🌞*'
if (jamss == 17) wish = '*ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ 🌥*'
if (jamss == 18) wish = '*ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ 🌥*'
if (jamss == 19) wish = '*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*'
if (jamss == 20) wish = '*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*'
if (jamss == 21) wish = '*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*'
if (jamss == 22) wish = '*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*'
if (jamss == 23) wish = '*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*'


if (config.ZARA_AI == 'true') eva = ' ᴏɴ'
if (config.ZARA_AI == 'false') eva = ' ᴏғғ'
if (config.ANTİLİNK == 'true') auto_bio = ' ᴏɴ'
if (config.ANTİLİNK == 'false') auto_bio = ' ᴏғғ'


Rashi.tozara({ pattern: 'menu', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {
  // send a list message!
  const rows = [

    { title: '𝙰𝙻𝙻 𝙲𝙼𝙽𝙳𝚂', description:'', rowId: ".help" },

   { title: '𝙾𝚆𝙽𝙴𝚁 𝙲𝙼𝙽𝙳𝚂', description: '', rowId: ".ownercmnd" },
 
    { title: '𝚇 𝙼𝙴𝙳𝙸𝙰', description: "",rowId: ".xmedia" },

    { title: '𝙻𝙾𝙶𝙾 𝙿𝙰𝙲𝙺', description: ``, rowId: ".logopack" },
    
    { title: '𝚃𝚁𝙾𝙻𝙻 𝙿𝙰𝙲𝙺', description: ``, rowId: ".logopack2" }
    
       ]
const desc = `*╭────────────────*\n*┊      ʜᴇʏ ʙʀᴏ* ` + wish +`\n*┊*\n*┊ ɴᴀᴍᴇ :* ` + Config.BOTPLK + `\n*┊ ᴛɪᴍᴇ :* ` + time + `\n*┊ ᴏᴡɴᴇʀ :* ` + Config.PLK + `\n*┊ ᴢᴀʀᴀ ᴀɪ :* ` + eva + `\n*┊ ᴡᴋ ᴛʏᴘᴇ :* ` + Config.WORKTYPE + `\n*┊ ᴀɴᴛɪ ʟɪɴᴋ :* ` + auto_bio + `\n*┊ ʜᴀɴᴅɪʟᴇʀs :* ` + Config.HANDLERS + `\n*┊*\n*┊*   ` + zara.DESC + `\n*┊*\n*╰────────────────*`
 
  const sections = [{ title: "  𝒆𝒏𝒋𝒐𝒚 𝒐𝒖𝒓 𝒔𝒆𝒓𝒗𝒊𝒄𝒆", rows: rows }]

  const button = {
    buttonText: 'ᴄʟɪᴄᴋ ʜᴇʀᴇ!',
    description: desc,
    sections: sections,
    listType: 1
  }

  await message.client.sendMessage(message.jid, button, MessageType.listMessage)

}));
