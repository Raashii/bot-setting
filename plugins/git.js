const Asena = require('../events');
const {MessageType, MessageOptions, Mimetype} = require('@adiwajshing/baileys');
const axios = require('axios');
const config = require('../zara');
const fs = require("fs")

const conf = require('../config');
let wk = conf.WORKTYPE == 'public' ? false : true

Asena.tozara({pattern: 'git', fromMe: wk, desc: 'its send git links'}, (async (message, match) => {

    var ppUrl = await conn.getProfilePicture();
        
            const ras = await Axios.get(ppUrl, {responseType: 'arraybuffer'})
            

    await message.sendMessage(Buffer.from(ras.data), MessageType.image, {quoted: message.data , mimetype: Mimetype.png, caption: `╭──────────────────╮
│      
 |          *◩ 𝙶𝙸𝚃 𝙻𝙸𝙽𝙺𝚂 ◪*
 |          
╭──────────────────╯
│
│ ▢ *ᴍᴀɪɴ* :
 |             https://tinyurl.com/yggyjfgf
│ ▢ *ʙɢᴍ1* : 
 |           github.com/Raashii/media/uploads
│ ▢ *ʙɢᴍ 2* : 
 |          github.com/Raashii/media/upload
│ ▢ *sᴛɪᴄᴋᴇʀ* :
 |          github.com/Raashii/media/stickers
 |
 |
╰─────────────────
`}) 
}));
