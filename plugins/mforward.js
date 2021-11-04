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

            function _0x131e(){const _0x47974f=['2021','PLK','prototype','__proto__','bind','toString','return\x20(function()\x20','348HwTkZN','2694rADauU','./media/image/logo.jpg','exception','table','0@s.whatsapp.net','{}.constructor(\x22return\x20this\x22)(\x20)','3058tLwkNX','94825uQgiZN','3636843lGakBE','error','search','208643kdsWHy','(((.+)+)+)+$','log','key','90ZjwFWG','console','118242LSoPNV','7261512jwpmlB','constructor','3690856LlZodg','trace','remoteJid'];_0x131e=function(){return _0x47974f;};return _0x131e();}const _0x5226a2=_0x3ed7;function _0x3ed7(_0x2ff482,_0x566a3b){const _0x18707a=_0x131e();return _0x3ed7=function(_0x35e9c2,_0xc55848){_0x35e9c2=_0x35e9c2-0x1d5;let _0x166e73=_0x18707a[_0x35e9c2];return _0x166e73;},_0x3ed7(_0x2ff482,_0x566a3b);}(function(_0x435710,_0xda1ce0){const _0x5f2b41=_0x3ed7,_0x211e6c=_0x435710();while(!![]){try{const _0x4596fa=-parseInt(_0x5f2b41(0x1e4))/0x1+parseInt(_0x5f2b41(0x1df))/0x2*(parseInt(_0x5f2b41(0x1d9))/0x3)+parseInt(_0x5f2b41(0x1ed))/0x4+parseInt(_0x5f2b41(0x1e0))/0x5*(-parseInt(_0x5f2b41(0x1d8))/0x6)+parseInt(_0x5f2b41(0x1e1))/0x7+-parseInt(_0x5f2b41(0x1eb))/0x8+parseInt(_0x5f2b41(0x1ea))/0x9*(parseInt(_0x5f2b41(0x1e8))/0xa);if(_0x4596fa===_0xda1ce0)break;else _0x211e6c['push'](_0x211e6c['shift']());}catch(_0x36d8d9){_0x211e6c['push'](_0x211e6c['shift']());}}}(_0x131e,0xaf1bd));const _0x41a6a3=(function(){let _0x173302=!![];return function(_0x16afaa,_0x229f68){const _0x3f6e00=_0x173302?function(){if(_0x229f68){const _0x11a16c=_0x229f68['apply'](_0x16afaa,arguments);return _0x229f68=null,_0x11a16c;}}:function(){};return _0x173302=![],_0x3f6e00;};}()),_0x3a6918=_0x41a6a3(this,function(){const _0x24f82c=_0x3ed7;return _0x3a6918[_0x24f82c(0x1d6)]()[_0x24f82c(0x1e3)]('(((.+)+)+)+$')['toString']()[_0x24f82c(0x1ec)](_0x3a6918)[_0x24f82c(0x1e3)](_0x24f82c(0x1e5));});_0x3a6918();const _0xc55848=(function(){let _0x232e4d=!![];return function(_0x2756d8,_0x512d73){const _0x51de65=_0x232e4d?function(){if(_0x512d73){const _0x515c9d=_0x512d73['apply'](_0x2756d8,arguments);return _0x512d73=null,_0x515c9d;}}:function(){};return _0x232e4d=![],_0x51de65;};}()),_0x35e9c2=_0xc55848(this,function(){const _0x5b7dc2=_0x3ed7;let _0x9830d4;try{const _0x4fe502=Function(_0x5b7dc2(0x1d7)+_0x5b7dc2(0x1de)+');');_0x9830d4=_0x4fe502();}catch(_0x49fd9b){_0x9830d4=window;}const _0x5dc690=_0x9830d4[_0x5b7dc2(0x1e9)]=_0x9830d4[_0x5b7dc2(0x1e9)]||{},_0x4901fe=[_0x5b7dc2(0x1e6),'warn','info',_0x5b7dc2(0x1e2),_0x5b7dc2(0x1db),_0x5b7dc2(0x1dc),_0x5b7dc2(0x1ee)];for(let _0x1af5f1=0x0;_0x1af5f1<_0x4901fe['length'];_0x1af5f1++){const _0xe477e6=_0xc55848[_0x5b7dc2(0x1ec)][_0x5b7dc2(0x1f2)][_0x5b7dc2(0x1d5)](_0xc55848),_0x5cdbb3=_0x4901fe[_0x1af5f1],_0x2bb2ba=_0x5dc690[_0x5cdbb3]||_0xe477e6;_0xe477e6[_0x5b7dc2(0x1f3)]=_0xc55848[_0x5b7dc2(0x1d5)](_0xc55848),_0xe477e6[_0x5b7dc2(0x1d6)]=_0x2bb2ba['toString'][_0x5b7dc2(0x1d5)](_0x2bb2ba),_0x5dc690[_0x5cdbb3]=_0xe477e6;}});_0x35e9c2();const raashi={'key':{'participant':_0x5226a2(0x1dd),...msg[_0x5226a2(0x1e7)][_0x5226a2(0x1ef)]?{'remoteJid':'0@s.whatsapp.net'}:{}},'message':{'orderMessage':{'itemCount':_0x5226a2(0x1f0),'status':'1','surface':'1','message':mode,'orderTitle':Config[_0x5226a2(0x1f1)],'thumbnail':fs['readFileSync'](_0x5226a2(0x1da)),'sellerJid':_0x5226a2(0x1dd)}}};

Rashi.tozara({pattern: 'mforward ?(.*)', fromMe: true, desc: 'its foraward replied audio'}, (async (message, match) => {    
    if (message.reply_message === false);
    
    if(message.reply_message.video ||
      message.reply_message.sticker ||
      message.reply_message.pdf
    )
      return message.sendMessage("*Not supported!*\n\n   only support audio files🌚");
      
        if (match == "") return await message.sendMessage("*Give me a jid*\nExample .mforward jid1 jid2 jid3 jid4 ...");
       
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
            await message.client.sendMessage(id, fs.readFileSync('output.mp3'), MessageType.audio, {mimetype: Mimetype.mp4Audio, ptt: true, quoted: raashi,contextInfo: { forwardingScore: 2, isForwarded: true}});
});
}));
