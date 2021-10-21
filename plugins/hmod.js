const Asena = require('../events');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const got = require('got');
const Config = require('../config');

const axios = require('axios')


const conf = require('../config');
let wk = conf.WORKTYPE == 'public' ? false : true

Asena.tozara({pattern: 'hmod ?(.*)', fromMe: wk, desc: 'it send mod apk links' }, async (message, match) => {

	if (match[1] === '') return await message.client.sendMessage(message.jid, '```Need apk name 🍁```', MessageType.text)
       
        const {data} = await axios(`https://api.zeks.me/api/happymod?apikey=ApiKannappi&q=${match[1]}`)
	
        const { status, result } = data

        if(!status) return await message.sendMessage('```NO RESULT FOUND🥲```')
	
                var mesaj = '';
        result.all.map((mod) => {
            mesaj += '*' + mod.title + '* - \n' + mod.url + '\n *Rating' + mod.rating + '⭐* \n'
});
         return await message.client.sendMessage(message.jid, mesaj, MessageType.text, { quoted: message.data })   
});
    
