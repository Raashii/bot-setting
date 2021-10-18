const Asena = require('../events');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const got = require('got');
const Config = require('../config');
const LOAD_ING = "*ᴜᴘʟᴏᴀᴅɪɴɢ...*"
const axios = require('axios')
const Axios = require('axios')

const conf = require('../config');
let wk = conf.WORKTYPE == 'public' ? false : true

Asena.tozara({pattern: 'play ?(.*)', fromMe: wk, desc: 'play song' , dontAddCommandList: true }, async (message, match) => {
	
        const {data} = await axios(`https://zenzapi.xyz/api/play/playmp3?query=${match[1]}&apikey=Raashii`)
	
        const { status, result } = data

	var img = await Axios.get(`${result.thumb}`, {responseType: 'arraybuffer'})

        if(!status) return await message.sendMessage('*NO RESULT FOUND🥲*')
	
        await message.client.sendMessage(message.jid, LOAD_ING , MessageType.text, { quoted: message.data });
        let msg = '```'
        msg +=  `TITLE :${result.title}\n\n`
        msg +=  `THUMBNAIL :${result.thumb}\n\n`
        msg +=  `CHANNEL :${result.channel}\n\n`
        msg +=  `DATE OF PUBLISHED :${result.published}\n\n`
        msg +=  `TOTAL VIEWS :${result.views}\n\n`
        msg +=  `DOWNLOADING LINK :${result.url}\n\n`
        msg += '```'
         return await message.client.sendMessage(message.jid,Buffer.from(img.data), MessageType.image, {Mimetype: Mimetype.jpg , caption: msg })
        });
    
