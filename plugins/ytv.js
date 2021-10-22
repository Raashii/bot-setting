/* Coded by rashi
*/

const Asena = require('../events');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const got = require('got');
const Config = require('../config');
const LOAD_ING = "*ᴜᴘʟᴏᴀᴅɪɴɢ...*"
const axios = require('axios')
const Axios = require('axios')

const conf = require('../config');
let wk = conf.WORKTYPE == 'public' ? false : true

Asena.tozara({pattern: 'ytv ?(.*)', fromMe: wk, desc: 'video downloading links from youtube'}, async (message, match) => {
	
        const {data} = await axios(`http://fxc7-api.herokuapp.com/api/download/playmp4?query=${match[1]}&apikey=XFUM7eRxDQ`)
	
        const { status, result } = data

	var img = await Axios.get(`${result.link}`, {responseType: 'arraybuffer'})

        if(!status) return await message.sendMessage('*NO RESULT FOUND🥲*')
	
        await message.client.sendMessage(message.jid, LOAD_ING , MessageType.text, { quoted: message.data });
        let msg = '```'
        msg +=  `TITLE :${result.title}\n\n`
        msg +=  `THUMBNAIL :${result.thumb}\n\n`
        msg +=  `CHANNEL :${result.channel}\n\n`
        msg +=  `PUBLISHED :${result.publish}\n\n`
        msg +=  `VIEWS :${result.views}\n\n`
        msg += '```'
         return await message.client.sendMessage(message.jid,Buffer.from(img.data), MessageType.video, {mimetype: Mimetype.mp4 , caption: msg })
        });
    
