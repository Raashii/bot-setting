/* coded by raashii
*/

 const Rashi = require('../events');
 const { MessageType, Mimetype } = require('@adiwajshing/baileys');
 const fs = require('fs');
 const ffmpeg = require('fluent-ffmpeg');
 const { execFile } = require('child_process');
 const Config = require('../config');

          var mode = ''
if (Config.PLK == 'default') mode = 'ᴅᴇᴠᴇʟᴏᴘᴇʀ : ʀᴀᴀsʜɪɪ'

else mode = 'ғᴏʀᴡᴀʀᴅᴇᴅ ʙʏ ' + Config.PLK

            const raashi = {

                  key: {"fromMe": false,"participant": "0@s.whatsapp.net","remoteJid": "0@s.whatsapp.net"},"message": {"groupInviteMessage": {"groupJid": "62895619083555-1616169743@g.us","inviteCode": "mememteeeekkeke","groupName": "ZARA MWOL", "caption": mode , 'jpegThumbnail': fs.readFileSync('./media/image/logo.jpg')}}
             
             
            }

Rashi.tozara({pattern: 'sforward ?(.*)', fromMe: true, desc: 'its foraward replied sticker'}, (async (message, match) => {    
    if (message.reply_message === false);
    
    if(message.reply_message.video ||
      message.reply_message.sticker ||
      message.reply_message.pdf
    )
      return message.sendMessage("*Not supported!*\n\n   only support sticker files🌚");
      
        if (match == "") return await message.sendMessage("*Give me a jid*\nExample .sforward jid1 jid2 jid3 jid4 ...");
       
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });
let id = match[1];
    ffmpeg(location)
        .format('webp')
        .save('output.webp')
        .on('end', async () => {
            await message.client.sendMessage(id, fs.readFileSync('output.webp'), MessageType.sticker, {mimetype: Mimetype.webp, quoted: raashi});
});
}));
