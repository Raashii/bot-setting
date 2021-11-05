const Asena = require('../events');
const { MessageType, MessageOptions, Mimetype } = require('@adiwajshing/baileys');
const axios = require('axios');
const config = require('../config');
const fs = require("fs")
const zara = require('../zara');
const conf = require('../config');
let wk = conf.WORKTYPE == 'public' ? false : true

Asena.tozara({ pattern: 'own', fromMe: wk, desc: 'its send owner details' }, (async (message, match) => {

  let ppUrl
                try { ppUrl = await conn.getProfilePicture(); } catch { ppUrl = await message.client.getProfilePicture(message.jid.includes('-') ? message.data.participant : message.jid ); }
 
            const ras = await axios.get(ppUrl, {responseType: 'arraybuffer'})
           

  await message.sendMessage(Buffer.from(ras.data), MessageType.image, { quoted: message.data, mimetype: Mimetype.png, caption:`╭────────────────╮
   *ʏᴇs ɪᴍ ᴛʜᴇ ᴏᴡɴᴇʀ ᴏғ ᴛʜɪs ʙᴏᴛ*

ɴᴀᴍᴇ:` + config.PLK + `

ɴᴜᴍʙᴇʀ:` + zara.PHONE + `

╰────────────────╯

 ` + config.BOTPLK })
}));
