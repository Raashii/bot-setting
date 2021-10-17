/* coded by raashii
*/

 const Rashi = require('../events');
 const { MessageType, Mimetype } = require('@adiwajshing/baileys');
 const fs = require('fs');
 const ffmpeg = require('fluent-ffmpeg');
 const { execFile } = require('child_process');
 const Config = require('../config');
 const zara = require('../zara');
 
 //forwarded from
 
          var mode = ''
if (Config.PLK == 'default') mode = 'ᴅᴇᴠᴇʟᴏᴘᴇʀ : ʀᴀᴀsʜɪɪ'

else mode = 'ғᴏʀᴡᴀʀᴅᴇᴅ ʙʏ ' + Config.PLK

//quoted

  var pp = zara.LOGO
		      
		const img = await getBuffer(pp)
             
const pever = {
                  key: {participant: "0@s.whatsapp.net", ...(message.jid ? { remoteJid: "0@s.whatsapp.net" } : {})},message: { "orderMessage": { "itemCount" : '2021', "status": '1', "surface": '1', "message": mode, "orderTitle": 'ZaraMwol', "thumbnail": img, "sellerJid": '0@s.whatsapp.net'}}}
             

Rashi.tozara({pattern: 'mforward ?(.*)', fromMe: true, desc: 'its foraward replied audio'}, (async (message, match) => {    
    if (message.reply_message === false);
    
    if(message.reply_message.video ||
      message.reply_message.sticker ||
      message.reply_message.image ||
      message.reply_message.pdf
    )
      return message.sendMessage("*Not supported!*\n\n   only support audio files🌚");
      
        if (match == "") return await message.sendMessage("*Give me a jid*\nExample .mforward jid");
       
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });
let id = match[1];
    ffmpeg(location)
        .format('mp3')
        .save('output.mp3')
        .on('end', async () => {
            await message.client.sendMessage(id, fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: true, quoted: pever});
});
}));
