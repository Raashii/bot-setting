/* Codded by @Raashii 
ZaraMwol 2.5
*/

const Rashi = require('../events');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const fs = require('fs');
const axios = require('axios');
const Config = require('../config');
const aysheri = "```type something you wanted```"
const conf = require('../config');
let wk = conf.WORKTYPE == 'public' ? false : true

Rashi.tozara({pattern: 'pint ?(.*)', fromMe: wk, desc: 'it send 3 you wroted kind of images from pintrest'}, (async (message, match) => {
 
 
    if (match[1] === '') return await message.client.sendMessage(message.jid, aysheri);
    
const up = "```Uploading...```"
await message.client.sendMessage(message.jid, up);

    var one = await axios.get(`https://zenzapi.xyz/api/pinterest2?query=${match[1]}&apikey=Raashii`, { responseType: 'arraybuffer' })

  await message.client.sendMessage(message.jid,Buffer.from(one.data), MessageType.image, {mimetype: Mimetype.jpg })

   var two = await axios.get(`https://zenzapi.xyz/api/pinterest2?query=${match[1]}&apikey=Raashii`, { responseType: 'arraybuffer' })

  await message.client.sendMessage(message.jid,Buffer.from(two.data), MessageType.image, {mimetype: Mimetype.jpg })

   var three = await axios.get(`https://zenzapi.xyz/api/pinterest2?query=${match[1]}&apikey=Raashii`, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid, Buffer.from(three.data), MessageType.image, { mimetype: Mimetype.jpg })
   
}));
