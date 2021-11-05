const Asena = require('../events');
const { MessageType, MessageOptions, Mimetype } = require('@adiwajshing/baileys');
const axios = require('axios');
const config = require('../config');
const fs = require("fs")
const config = require('../zara');
const conf = require('../config');
let wk = conf.WORKTYPE == 'public' ? false : true

Asena.tozara({ pattern: 'git', fromMe: wk, desc: 'its send git links' }, (async (message, match) => {

  var ppUrl = await conn.getProfilePicture();

  const ras = await Axios.get(ppUrl, { responseType: 'arraybuffer' })


  await message.sendMessage(Buffer.from(ras.data), MessageType.image, { quoted: message.data, mimetype: Mimetype.png, caption:`╭────────────────╮
   *ʏᴇs ɪᴍ ᴛʜᴇ ᴏᴡɴᴇʀ ᴏғ ᴛʜɪs ʙᴏᴛ*

ɴᴀᴍᴇ:` + config.PLK + `

ɴᴜᴍʙᴇʀ:` + zara.PHONE + `

╰────────────────╯

 ` + config.BOTPLK })
}));
