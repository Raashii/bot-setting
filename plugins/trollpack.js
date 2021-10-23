/* Codded by @j0ker_ser
edited by @Raashii 
ZaraMwol V2
*/

const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');

const fs = require('fs');

const axios = require('axios');

const Config = require('../config');

const Asena = require('../events');

let wk = Config.WORKTYPE == 'public' ? false : true

const err = "╭────────────────╮ \n              *ᴛʀᴏʟʟ ᴘᴀᴄᴋ* \n╰────────────────╯\n                *ᴇxᴀᴍᴘʟᴇ*\n╭──────────────── \n│ .1sᴇᴅ ᴛʀᴏʟʟ;ᴘᴀᴄᴋ \n│   ▢ ᴛʀᴏʟʟ=ᴛᴏᴘ \n│   ▢ ᴘᴀᴄᴋ=ʙᴏᴛᴛᴏᴍ \n╰────────────────╯"

const ll ="```Type something🙇‍♂️```"

const Ln = "▷🤖നിങ്ങൾ ആഗ്രഹിക്കുന്ന രീതിയിൽ മെമ്മുകൾ ഇച്ഛാനുസൃതമാക്കാൻ മെമ്മെ ലിസ്റ്റ്◁"

 const code = `╭────────────────╮
               *ᴛʀᴏʟʟ ᴘᴀᴄᴋ*
╰────────────────╯
               *ᴄᴏᴍᴍᴀɴᴅs*

❏  ᴄᴀᴛ ᴘᴀᴄᴋ
╭────────────────
│ ▢ 𝟷ᴄᴀᴛ
│ ▢ 𝟸ᴄᴀᴛ
│ ▢ 𝟹ᴄᴀᴛ
│ ▢ 𝟺ᴄᴀᴛ
│ ▢ 𝟻ᴄᴀᴛ
╰────────────────

❏ ɢᴜʜᴀɴ ᴘᴀᴄᴋ

╭────────────────
│ ▢ 𝟷ɢᴜʜᴀɴ
│ ▢ 𝟸ɢᴜʜᴀɴ
│ ▢ 𝟹ɢᴜʜᴀɴ
│ ▢ 𝟺ɢᴜʜᴀɴ
│ ▢ 𝟻ɢᴜʜᴀɴ
╰────────────────

 ❏ sᴇᴅ ᴘᴀᴄᴋ

╭────────────────
│ ▢ 𝟷sᴇᴅ
│ ▢ 𝟸sᴇᴅ
│ ▢ 𝟹sᴇᴅ
│ ▢ 𝟺sᴇᴅ
│ ▢ 𝟻sᴇᴅ
╰────────────────

╭────────────────╮
            *ᴛʀᴏʟʟ ᴘᴀᴄᴋ ᴠ𝟷*
╰────────────────╯`

      Asena.tozara({pattern: 'trollpack', fromMe: false, desc: Ln,}, (async (message, match) => {

    await message.client.sendMessage(

  

      message.jid,code, MessageType.text);

  

  }));


    Asena.tozara({pattern: '1guhan ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
     return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/nWWVJuX.jpeg"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.jpg , caption: Config.AFN})

    }));
   
   Asena.tozara({pattern: '1sed ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/WT6W6eu.png"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.png , caption: Config.AFN})

    }));
   
   Asena.tozara({pattern: '1cat ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/gYeq2NH.jpeg"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.jpg , caption: Config.AFN})

    }));
   
   Asena.tozara({pattern: '2cat ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/4qTFMHo.jpeg"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.jpg , caption: Config.AFN})

    }));
   
   Asena.tozara({pattern: '3cat ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/JCmSq7P.jpeg"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.jpg , caption: Config.AFN})

    }));
   
   Asena.tozara({pattern: '2guhan ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/mBQCCZ2.jpeg"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.jpg , caption: Config.AFN})

    }));
   
      Asena.tozara({pattern: '4cat ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/1TXMSm4.jpeg"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.jpg , caption: Config.AFN})

    }));
   
   Asena.tozara({pattern: '5cat ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/dTyOnMv.jpeg"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.jpg , caption: Config.AFN})

    }));
   
   Asena.tozara({pattern: '3guhan ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/LpOmKGD.jpeg"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.jpg , caption: Config.AFN})

    }));
   
      Asena.tozara({pattern: '4guhan ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/T0rt5Ls.png"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.png , caption: Config.AFN})

    }));
   
   Asena.tozara({pattern: '5guhan ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/okos5sf.png"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.png , caption: Config.AFN})

    }));
   
   Asena.tozara({pattern: '2sed ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/v2oKzNP.png"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.png , caption: Config.AFN})

    }));
  
  Asena.tozara({pattern: '3sed ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/uytP8cB.png"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.png , caption: Config.AFN})

    }));
  
  Asena.tozara({pattern: '4sed ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/7y2z2Nh.png"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.png , caption: Config.AFN})

    }));
  
    Asena.tozara({pattern: '5sed ?(.*)', fromMe: wk, dontAddCommandList: true}, (async (message, match) => {

    if (match[1] === '') return await message.client.sendMessage(message.jid, ll);
  
  var topText, bottomText;
    if (match[1].includes(';')) {
        var split = match[1].split(';');
        bottomText = split[1];
        topText = split[0];
}
    else {
      
       return await message.client.sendMessage(
      message.jid,err, MessageType.text);
          }
    
   const img = "https://i.imgur.com/4aRG0OR.png"
   
    var web = await axios.get(`https://docs-jojo.herokuapp.com/api/meme-gen?top=${topText}&bottom=${bottomText}&img=` + img, { responseType: 'arraybuffer' })

   await message.client.sendMessage(message.jid,Buffer.from(web.data), MessageType.image, {mimetype: Mimetype.png , caption: Config.AFN})

    }));
   
