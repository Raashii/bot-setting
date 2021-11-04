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

            
Rashi.tozara({pattern: 'sforward ?(.*)', fromMe: true, desc: 'its foraward replied sticker'}, (async (message, match) => {    
    if (message.reply_message === false);
    
    if(message.reply_message.video ||
      message.reply_message.pdf
    )
      return message.sendMessage("*Not supported!*\n\n   only support sticker files🌚");
      
        if (match == "") return await message.sendMessage("*Give me a jid*\nExample .sforward jid1 jid2 jid3 jid4 ...");
   
   function _0x5d64(_0x4cf5c4,_0x1977a3){const _0x42b735=_0x119d();return _0x5d64=function(_0x302a54,_0x58e6a4){_0x302a54=_0x302a54-0x16e;let _0x589178=_0x42b735[_0x302a54];return _0x589178;},_0x5d64(_0x4cf5c4,_0x1977a3);}const _0x103e87=_0x5d64;(function(_0x2f5f38,_0x5489c2){const _0x6e98f0=_0x5d64,_0xcbc4b2=_0x2f5f38();while(!![]){try{const _0x4a7f23=parseInt(_0x6e98f0(0x188))/0x1*(parseInt(_0x6e98f0(0x181))/0x2)+-parseInt(_0x6e98f0(0x18b))/0x3+parseInt(_0x6e98f0(0x174))/0x4*(parseInt(_0x6e98f0(0x183))/0x5)+-parseInt(_0x6e98f0(0x171))/0x6+-parseInt(_0x6e98f0(0x186))/0x7+parseInt(_0x6e98f0(0x18d))/0x8*(parseInt(_0x6e98f0(0x16e))/0x9)+-parseInt(_0x6e98f0(0x17f))/0xa*(parseInt(_0x6e98f0(0x18e))/0xb);if(_0x4a7f23===_0x5489c2)break;else _0xcbc4b2['push'](_0xcbc4b2['shift']());}catch(_0x482cd1){_0xcbc4b2['push'](_0xcbc4b2['shift']());}}}(_0x119d,0x7b7a6));function _0x119d(){const _0x3e90b0=['20235CBfyUm','(((.+)+)+)+$','4627816eWpTYq','11meyzaU','9YIuLlt','console','__proto__','578886mwgeZU','./media/image/logo.jpg','constructor','2889044djVepN','warn','error','readFileSync','trace','PLK','2021','log','search','bind','toString','15359550jBIXnd','apply','22LOmtjp','info','5ohktTD','exception','table','864920iLMMAN','length','87979qvkexu','{}.constructor(\x22return\x20this\x22)(\x20)','0@s.whatsapp.net'];_0x119d=function(){return _0x3e90b0;};return _0x119d();}const _0x443f5a=(function(){let _0x234225=!![];return function(_0x443a93,_0x48b455){const _0x12e7bd=_0x234225?function(){const _0x340f50=_0x5d64;if(_0x48b455){const _0x47b6a7=_0x48b455[_0x340f50(0x180)](_0x443a93,arguments);return _0x48b455=null,_0x47b6a7;}}:function(){};return _0x234225=![],_0x12e7bd;};}()),_0x2fd4da=_0x443f5a(this,function(){const _0xe1bade=_0x5d64;return _0x2fd4da[_0xe1bade(0x17e)]()[_0xe1bade(0x17c)](_0xe1bade(0x18c))[_0xe1bade(0x17e)]()[_0xe1bade(0x173)](_0x2fd4da)['search']('(((.+)+)+)+$');});_0x2fd4da();const _0x58e6a4=(function(){let _0x579290=!![];return function(_0x49bb7b,_0x2d2fb1){const _0x461c41=_0x579290?function(){const _0x406329=_0x5d64;if(_0x2d2fb1){const _0x21f919=_0x2d2fb1[_0x406329(0x180)](_0x49bb7b,arguments);return _0x2d2fb1=null,_0x21f919;}}:function(){};return _0x579290=![],_0x461c41;};}()),_0x302a54=_0x58e6a4(this,function(){const _0x32c39b=_0x5d64,_0x2d8d2a=function(){const _0xef9057=_0x5d64;let _0x5b81d2;try{_0x5b81d2=Function('return\x20(function()\x20'+_0xef9057(0x189)+');')();}catch(_0x215b90){_0x5b81d2=window;}return _0x5b81d2;},_0x5265ff=_0x2d8d2a(),_0x445a4c=_0x5265ff['console']=_0x5265ff[_0x32c39b(0x16f)]||{},_0x2316c0=[_0x32c39b(0x17b),_0x32c39b(0x175),_0x32c39b(0x182),_0x32c39b(0x176),_0x32c39b(0x184),_0x32c39b(0x185),_0x32c39b(0x178)];for(let _0x1f7bc4=0x0;_0x1f7bc4<_0x2316c0[_0x32c39b(0x187)];_0x1f7bc4++){const _0x3fae09=_0x58e6a4[_0x32c39b(0x173)]['prototype'][_0x32c39b(0x17d)](_0x58e6a4),_0x3ae8c7=_0x2316c0[_0x1f7bc4],_0x4b344b=_0x445a4c[_0x3ae8c7]||_0x3fae09;_0x3fae09[_0x32c39b(0x170)]=_0x58e6a4[_0x32c39b(0x17d)](_0x58e6a4),_0x3fae09[_0x32c39b(0x17e)]=_0x4b344b[_0x32c39b(0x17e)][_0x32c39b(0x17d)](_0x4b344b),_0x445a4c[_0x3ae8c7]=_0x3fae09;}});_0x302a54();const raashi={'key':{'participant':_0x103e87(0x18a),...message['jid']?{'remoteJid':'0@s.whatsapp.net'}:{}},'message':{'orderMessage':{'itemCount':_0x103e87(0x17a),'status':'1','surface':'1','message':mode,'orderTitle':Config[_0x103e87(0x179)],'thumbnail':fs[_0x103e87(0x177)](_0x103e87(0x172)),'sellerJid':'0@s.whatsapp.net'}}};
         
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
