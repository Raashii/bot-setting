/* # Exclusively from raashii
 */ 

const Rashi = require('../events');
const { MessageType, MessageOptions, Mimetype } = require('@adiwajshing/baileys');
const fs = require('fs');
const axios = require('axios');
const Config = require('../zara');
const config = require('../config');

if (config.WORKTYPE == 'private') {

Rashi.tozara({pattern: 'number', fromMe: true, desc: 'Its send owner number'}, (async (message, match) => {

            const Raashii = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n' 
            + 'FN:' + config.PLK + '\n' //created afnanplk, please copy this with credit..
            + 'ORG:Zara fam;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=' + Config.PHONE + ':' + Config.PHONE + ' \n'
            + 'END:VCARD'
await message.client.sendMessage(message.jid, {displayname: "Owner", vcard: Raashii}, MessageType.contact);

  }));
}

else if (config.WORKTYPE == 'public') {

Rashi.tozara({pattern: 'number', fromMe: false, desc: 'Its send owner number'}, (async (message, match) => {
         var mode = ''
if (config.PLK == 'Raashii') mode = 'ᴅᴇᴠᴇʟᴏᴘᴇʀ : '

else mode = 'ᴏᴡɴᴇʀ : '
            
            const Raashii = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n' 
            + 'FN:' + mode + Config.OA_NAME + '\n' //created afnanplk, please copy this with credit..
            + 'ORG:Zara fam;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=' + Config.PHONE + ':' + Config.PHONE + ' \n'
            + 'END:VCARD'
await message.client.sendMessage(message.jid, {displayname: "Owner", vcard: Raashii}, MessageType.contact);

  }));
}
