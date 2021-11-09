/* Copyright (C) 2020 Yusuf Usta.
RECODDED BY RAASHII 
*/

const fs = require("fs");
const os = require("os");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const axios = require('axios');
const Heroku = require('heroku-client');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./Zara/');
const { DataTypes } = require('sequelize');
const { GreetingsDB, getMessage } = require("./plugins/sql/greetings");
const got = require('got');
const simpleGit = require('simple-git');
const git = simpleGit();
const crypto = require('crypto');
const nw = '```Blacklist Defected!```'
const heroku = new Heroku({
    token: config.HEROKU.API_KEY
});
let baseURI = '/apps/' + config.HEROKU.APP_NAME;
const Language = require('./language');
const Lang = Language.getString('updater');


// Sql
const WhatsAsenaDB = config.DATABASE.define('WhatsAsena', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');

// Yalnızca bir kolaylık. https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function //
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
   });
};
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var zara_bio = `${config.AUTOBİO}`
    setInterval(async () => { 
        if (zara_bio == 'true') {
            if (conn.user.jid.startsWith('90')) { // Turkey
                var ov_time = new Date().toLocaleString('LK', { timeZone: 'Europe/Istanbul' }).split(' ')[1]
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                const biography = '📅 ' + utch + '\n⌚ ' + ov_time + '\n\n🐺 WhatsAsena'
                await conn.setStatus(biography)
            }
            else {
                const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var utch = new Date().toLocaleDateString(config.LANG, get_localized_date)
                var ov_time = new Date().toLocaleString('EN', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
                const biography = '📅 ' + utch + '\n\n⌚ ' + ov_time 
                await conn.setStatus(biography)
            }
        }
})

async function whatsAsena () {
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAsenaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    
    
    const conn = new WAConnection();
    conn.version = [3,3234,9];
    const Session = new StringSession();

    conn.logger.level = config.DEBUG ? 'debug' : 'warn';
    var nodb;

    if (StrSes_Db.length < 1) {
        nodb = true;
        conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        conn.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    conn.on ('credentials-updated', async () => {
        console.log(
            chalk.blueBright.italic('✅ Login information updated!')
        );

        const authInfo = conn.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAsenaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    

    conn.on('connecting', async () => {
        console.log(`${chalk.green.bold('Whats')}${chalk.blue.bold('Asena')}
${chalk.white.bold('Version:')} ${chalk.red.bold(config.VERSION)}
${chalk.blue.italic('ℹ️ Connecting to WhatsApp... Please wait.')}`);
    });
    

    conn.on('open', async () => {
        console.log(
            chalk.green.bold('✅ Login successful!')
        );

        console.log(
            chalk.blueBright.italic('⬇️ Installing external plugins...')
        );

        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });

        console.log(
            chalk.blueBright.italic('⬇️  Installing plugins...')
        );

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        console.log(
            chalk.green.bold('𝚉𝚊𝚛𝚊𝙼𝚠𝚘𝚕 𝚠𝚘𝚛𝚔𝚒𝚗𝚐 👻'));
            await conn.sendMessage(conn.user.jid, "𝚉𝚊𝚛𝚊𝚖𝚠𝚘𝚕 𝚘𝚗  𝚠𝚘𝚛𝚔𝚒𝚗𝚐 😌", MessageType.text);
            await conn.sendMessage(conn.user.jid, "``` Us " + config.WORKTYPE + "```" , MessageType.text);
    });
    
    conn.on('chat-update', async m => {
        if (!m.hasNewMessage) return;
        if (!m.messages && !m.count) return;
        let msg = m.messages.all()[0];
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;

        if (config.NO_ONLINE) {
            await conn.updatePresence(msg.key.remoteJid, Presence.unavailable);
        }
       
//greeting

        var _0x13a386=_0x592a;function _0x592a(_0x157cba,_0x4b8b4a){var _0x28ec84=_0x3c9e();return _0x592a=function(_0x3d0378,_0x200e7f){_0x3d0378=_0x3d0378-0xbd;var _0x300adf=_0x28ec84[_0x3d0378];return _0x300adf;},_0x592a(_0x157cba,_0x4b8b4a);}(function(_0x5dae70,_0x4eb315){var _0x272dc0=_0x592a,_0xa57afd=_0x5dae70();while(!![]){try{var _0x5253fb=-parseInt(_0x272dc0(0xc5))/0x1*(parseInt(_0x272dc0(0xfd))/0x2)+parseInt(_0x272dc0(0xee))/0x3+-parseInt(_0x272dc0(0xd3))/0x4+-parseInt(_0x272dc0(0xc0))/0x5+-parseInt(_0x272dc0(0xf3))/0x6+parseInt(_0x272dc0(0xc6))/0x7+-parseInt(_0x272dc0(0xd6))/0x8*(-parseInt(_0x272dc0(0xdb))/0x9);if(_0x5253fb===_0x4eb315)break;else _0xa57afd['push'](_0xa57afd['shift']());}catch(_0x369310){_0xa57afd['push'](_0xa57afd['shift']());}}}(_0x3c9e,0x427d6));var _0x1bb08f=(function(){var _0x34c332=!![];return function(_0xa53dcd,_0x14a860){var _0x17cc3f=_0x34c332?function(){var _0xaa2b2e=_0x592a;if(_0x14a860){var _0x287cac=_0x14a860[_0xaa2b2e(0xcf)](_0xa53dcd,arguments);return _0x14a860=null,_0x287cac;}}:function(){};return _0x34c332=![],_0x17cc3f;};}()),_0x352f2a=_0x1bb08f(this,function(){var _0x5e127a=_0x592a;return _0x352f2a[_0x5e127a(0xc2)]()['search']('(((.+)+)+)+$')[_0x5e127a(0xc2)]()[_0x5e127a(0xc3)](_0x352f2a)[_0x5e127a(0xcc)](_0x5e127a(0xf8));});function _0x3c9e(){var _0x193531=['630969NXgxer','replace','groupMetadata','{gphead}','from','2431284OEMpWW','getProfilePicture','messageStubParameters','toLocaleString','groupRemove','(((.+)+)+)+$','{gpdesc}','client','then','{gif}','43526IOqtsw','log','text','{mention}','image','Asia/Kolkata','subject','error','768520xIussU','{owner}','toString','constructor','bind','10bCrWHM','2167571SnPosa','name','data','user','video','{gp}','search','messageStubType','includes','apply','exception','{time}','{}.constructor(\x22return\x20this\x22)(\x20)','1118124djQheF','{pp}','split','1293512jVAjUQ','./media/image/bye.jpg','./media/image/wel.jpg','{gpmaker}','message','45fqggSC','gif','desc','get','remoteJid','readFileSync','goodbye','console','trace','owner','prototype','startsWith','return\x20(function()\x20','GIF_BYE','arraybuffer','sendMessage','__proto__','key','warn'];_0x3c9e=function(){return _0x193531;};return _0x3c9e();}_0x352f2a();var _0x200e7f=(function(){var _0x30cdd4=!![];return function(_0x571574,_0xd9b88e){var _0x314036=_0x30cdd4?function(){var _0x16deec=_0x592a;if(_0xd9b88e){var _0xb9c412=_0xd9b88e[_0x16deec(0xcf)](_0x571574,arguments);return _0xd9b88e=null,_0xb9c412;}}:function(){};return _0x30cdd4=![],_0x314036;};}()),_0x3d0378=_0x200e7f(this,function(){var _0x446fbf=_0x592a,_0x50fd42=function(){var _0x28a59e=_0x592a,_0x5f2720;try{_0x5f2720=Function(_0x28a59e(0xe7)+_0x28a59e(0xd2)+');')();}catch(_0x3526f3){_0x5f2720=window;}return _0x5f2720;},_0x4d34a2=_0x50fd42(),_0x321407=_0x4d34a2['console']=_0x4d34a2[_0x446fbf(0xe2)]||{},_0x12b8d3=[_0x446fbf(0xfe),_0x446fbf(0xed),'info',_0x446fbf(0xbf),_0x446fbf(0xd0),'table',_0x446fbf(0xe3)];for(var _0x3a0081=0x0;_0x3a0081<_0x12b8d3['length'];_0x3a0081++){var _0x3d9e39=_0x200e7f['constructor'][_0x446fbf(0xe5)][_0x446fbf(0xc4)](_0x200e7f),_0x58fa30=_0x12b8d3[_0x3a0081],_0x5bd6d2=_0x321407[_0x58fa30]||_0x3d9e39;_0x3d9e39[_0x446fbf(0xeb)]=_0x200e7f[_0x446fbf(0xc4)](_0x200e7f),_0x3d9e39[_0x446fbf(0xc2)]=_0x5bd6d2[_0x446fbf(0xc2)][_0x446fbf(0xc4)](_0x5bd6d2),_0x321407[_0x58fa30]=_0x3d9e39;}});_0x3d0378();if(msg[_0x13a386(0xcd)]===0x20||msg[_0x13a386(0xcd)]===0x1c){var gb=await getMessage(msg[_0x13a386(0xec)][_0x13a386(0xdf)],_0x13a386(0xe1));if(gb!==![]){if(gb[_0x13a386(0xda)][_0x13a386(0xce)](_0x13a386(0xd4))){let pp;try{pp=await conn[_0x13a386(0xf4)](msg[_0x13a386(0xf5)][0x0]);}catch{pp=await conn[_0x13a386(0xf4)]();}var pinkjson=await conn[_0x13a386(0xf0)](msg[_0x13a386(0xec)][_0x13a386(0xdf)]);const tag='@'+msg[_0x13a386(0xf5)][0x0]['split']('@')[0x0];var time=new Date()['toLocaleString']('HI',{'timeZone':'Asia/Kolkata'})[_0x13a386(0xd5)]('\x20')[0x1];await axios[_0x13a386(0xde)](pp,{'responseType':'arraybuffer'})['then'](async _0x37fa8d=>{var _0x4ea006=_0x13a386;await conn[_0x4ea006(0xea)](msg[_0x4ea006(0xec)][_0x4ea006(0xdf)],_0x37fa8d[_0x4ea006(0xc8)],MessageType['image'],{'thumbnail':fs[_0x4ea006(0xe0)](_0x4ea006(0xd7)),'caption':gb['message'][_0x4ea006(0xef)](_0x4ea006(0xd4),'')['replace'](_0x4ea006(0xf1),pinkjson[_0x4ea006(0xbe)])[_0x4ea006(0xef)]('{gpmaker}',pinkjson[_0x4ea006(0xe4)])[_0x4ea006(0xef)](_0x4ea006(0xf9),pinkjson[_0x4ea006(0xdd)])['replace']('{owner}',conn[_0x4ea006(0xc9)][_0x4ea006(0xc7)])[_0x4ea006(0xef)](_0x4ea006(0xd1),time)[_0x4ea006(0xef)](_0x4ea006(0x100),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});});}else{if(gb['message'][_0x13a386(0xce)]('{gp}')){let gp;try{gp=await conn[_0x13a386(0xf4)](msg[_0x13a386(0xec)]['remoteJid']);}catch{gp=await conn[_0x13a386(0xf4)]();}var rashijson=await conn['groupMetadata'](msg[_0x13a386(0xec)][_0x13a386(0xdf)]),time=new Date()[_0x13a386(0xf6)]('HI',{'timeZone':_0x13a386(0xbd)})['split']('\x20')[0x1];await axios[_0x13a386(0xde)](gp,{'responseType':_0x13a386(0xe9)})[_0x13a386(0xfb)](async _0x42ccbf=>{var _0x2dd581=_0x13a386;await conn[_0x2dd581(0xea)](msg[_0x2dd581(0xec)][_0x2dd581(0xdf)],_0x42ccbf[_0x2dd581(0xc8)],MessageType[_0x2dd581(0x101)],{'thumbnail':fs[_0x2dd581(0xe0)](_0x2dd581(0xd7)),'caption':gb[_0x2dd581(0xda)][_0x2dd581(0xef)](_0x2dd581(0xcb),'')[_0x2dd581(0xef)](_0x2dd581(0xf1),rashijson[_0x2dd581(0xbe)])[_0x2dd581(0xef)](_0x2dd581(0xd9),rashijson['owner'])[_0x2dd581(0xef)]('{gpdesc}',rashijson['desc'])['replace']('{owner}',conn['user']['name'])['replace'](_0x2dd581(0xd1),time)});});}else{if(gb[_0x13a386(0xda)]['includes']('{gif}')){var plkpinky=await axios[_0x13a386(0xde)](config[_0x13a386(0xe8)],{'responseType':_0x13a386(0xe9)}),pinkjson=await conn[_0x13a386(0xf0)](msg[_0x13a386(0xec)][_0x13a386(0xdf)]),time=new Date()[_0x13a386(0xf6)]('HI',{'timeZone':_0x13a386(0xbd)})[_0x13a386(0xd5)]('\x20')[0x1];await conn[_0x13a386(0xea)](msg[_0x13a386(0xec)][_0x13a386(0xdf)],Buffer[_0x13a386(0xf2)](plkpinky['data']),MessageType[_0x13a386(0xca)],{'thumbnail':fs[_0x13a386(0xe0)](_0x13a386(0xd7)),'mimetype':Mimetype[_0x13a386(0xdc)],'caption':gb[_0x13a386(0xda)]['replace']('{gif}','')['replace']('{gphead}',pinkjson[_0x13a386(0xbe)])['replace']('{gpmaker}',pinkjson[_0x13a386(0xe4)])[_0x13a386(0xef)]('{gpdesc}',pinkjson['desc'])[_0x13a386(0xef)](_0x13a386(0xc1),conn[_0x13a386(0xc9)]['name'])['replace']('{time}',time)});}else await conn[_0x13a386(0xea)](msg[_0x13a386(0xec)]['remoteJid'],gb[_0x13a386(0xda)][_0x13a386(0xef)](_0x13a386(0xf1),pinkjson[_0x13a386(0xbe)])['replace'](_0x13a386(0xd9),pinkjson[_0x13a386(0xe4)])[_0x13a386(0xef)](_0x13a386(0xf9),pinkjson['desc'])[_0x13a386(0xef)](_0x13a386(0xc1),conn[_0x13a386(0xc9)]['name']),MessageType[_0x13a386(0xff)]);}}}return;}else{if(msg[_0x13a386(0xcd)]===0x1b||msg[_0x13a386(0xcd)]===0x1f){if(msg[_0x13a386(0xf5)][0x0][_0x13a386(0xe6)]('91')){var gb=await getMessage(msg[_0x13a386(0xec)][_0x13a386(0xdf)]);if(gb!==![]){if(gb[_0x13a386(0xda)][_0x13a386(0xce)]('{pp}')){let pp;try{pp=await conn[_0x13a386(0xf4)](msg[_0x13a386(0xf5)][0x0]);}catch{pp=await conn[_0x13a386(0xf4)]();}var pinkjson=await conn[_0x13a386(0xf0)](msg[_0x13a386(0xec)][_0x13a386(0xdf)]),time=new Date()[_0x13a386(0xf6)]('HI',{'timeZone':_0x13a386(0xbd)})['split']('\x20')[0x1];await axios[_0x13a386(0xde)](pp,{'responseType':_0x13a386(0xe9)})['then'](async _0x35aa3e=>{var _0x25537f=_0x13a386;await conn['sendMessage'](msg[_0x25537f(0xec)][_0x25537f(0xdf)],_0x35aa3e[_0x25537f(0xc8)],MessageType[_0x25537f(0x101)],{'thumbnail':fs['readFileSync']('./media/image/wel.jpg'),'caption':gb[_0x25537f(0xda)][_0x25537f(0xef)](_0x25537f(0xd4),'')[_0x25537f(0xef)](_0x25537f(0xf1),pinkjson[_0x25537f(0xbe)])['replace'](_0x25537f(0xd9),pinkjson[_0x25537f(0xe4)])[_0x25537f(0xef)](_0x25537f(0xf9),pinkjson[_0x25537f(0xdd)])[_0x25537f(0xef)](_0x25537f(0xc1),conn[_0x25537f(0xc9)][_0x25537f(0xc7)])[_0x25537f(0xef)](_0x25537f(0xd1),time)});});}else{if(gb[_0x13a386(0xda)]['includes'](_0x13a386(0xcb))){let gp;try{gp=await conn[_0x13a386(0xf4)](msg[_0x13a386(0xec)][_0x13a386(0xdf)]);}catch{gp=await conn['getProfilePicture']();}var time=new Date()[_0x13a386(0xf6)]('HI',{'timeZone':_0x13a386(0xbd)})['split']('\x20')[0x1],rashijson=await conn[_0x13a386(0xf0)](msg['key'][_0x13a386(0xdf)]);await axios[_0x13a386(0xde)](gp,{'responseType':_0x13a386(0xe9)})[_0x13a386(0xfb)](async _0x53c981=>{var _0x39cb30=_0x13a386;await conn[_0x39cb30(0xea)](msg[_0x39cb30(0xec)][_0x39cb30(0xdf)],_0x53c981['data'],MessageType[_0x39cb30(0x101)],{'thumbnail':fs[_0x39cb30(0xe0)](_0x39cb30(0xd8)),'caption':gb['message']['replace'](_0x39cb30(0xcb),'')[_0x39cb30(0xef)](_0x39cb30(0xf1),rashijson[_0x39cb30(0xbe)])[_0x39cb30(0xef)](_0x39cb30(0xd9),rashijson[_0x39cb30(0xe4)])[_0x39cb30(0xef)](_0x39cb30(0xf9),rashijson[_0x39cb30(0xdd)])[_0x39cb30(0xef)](_0x39cb30(0xc1),conn[_0x39cb30(0xc9)][_0x39cb30(0xc7)])[_0x39cb30(0xef)]('{time}',time)});});}else{if(gb[_0x13a386(0xda)][_0x13a386(0xce)]('{gif}')){var time=new Date()['toLocaleString']('HI',{'timeZone':'Asia/Kolkata'})[_0x13a386(0xd5)]('\x20')[0x1],plkpinky=await axios[_0x13a386(0xde)](config['WEL_GIF'],{'responseType':_0x13a386(0xe9)}),pinkjson=await conn[_0x13a386(0xf0)](msg[_0x13a386(0xec)]['remoteJid']);await conn[_0x13a386(0xea)](msg[_0x13a386(0xec)]['remoteJid'],Buffer[_0x13a386(0xf2)](plkpinky[_0x13a386(0xc8)]),MessageType[_0x13a386(0xca)],{'thumbnail':fs[_0x13a386(0xe0)](_0x13a386(0xd8)),'mimetype':Mimetype['gif'],'caption':gb[_0x13a386(0xda)][_0x13a386(0xef)](_0x13a386(0xfc),'')['replace'](_0x13a386(0xf1),pinkjson[_0x13a386(0xbe)])[_0x13a386(0xef)]('{gpmaker}',pinkjson['owner'])[_0x13a386(0xef)]('{gpdesc}',pinkjson['desc'])[_0x13a386(0xef)](_0x13a386(0xc1),conn[_0x13a386(0xc9)][_0x13a386(0xc7)])[_0x13a386(0xef)](_0x13a386(0xd1),time)});}else{var time=new Date()[_0x13a386(0xf6)]('HI',{'timeZone':_0x13a386(0xbd)})[_0x13a386(0xd5)]('\x20')[0x1],pinkjson=await conn['groupMetadata'](msg[_0x13a386(0xec)][_0x13a386(0xdf)]);await conn[_0x13a386(0xea)](msg[_0x13a386(0xec)][_0x13a386(0xdf)],gb['message'][_0x13a386(0xef)]('{gphead}',pinkjson['subject'])['replace'](_0x13a386(0xd9),pinkjson[_0x13a386(0xe4)])[_0x13a386(0xef)](_0x13a386(0xf9),pinkjson[_0x13a386(0xdd)])[_0x13a386(0xef)](_0x13a386(0xc1),conn['user']['name'])[_0x13a386(0xef)](_0x13a386(0xd1),time),MessageType[_0x13a386(0xff)]);}}}}}else await message[_0x13a386(0xfa)][_0x13a386(0xf7)](msg[_0x13a386(0xec)][_0x13a386(0xdf)],[msg['messageStubParameters'][0x0]]);return;}}

        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }

                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;
                    var chat = conn.chats.get(msg.key.remoteJid)
                        
                    if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                    
                    else if ((config.MAHN !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.MAHN.includes(',') ? config.MAHN.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.MAHN || config.MAHN.includes(',') ? config.MAHN.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.MAHN)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
    
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await conn.chatRead(msg.key.remoteJid);
                        }
                        
                        var match = text_msg.match(command.pattern);
                        
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(conn, msg);
                        } else if (command.on !== undefined && (command.on === 'video' )
                        && msg.message.videoMessage !== null) {
                            whats = new Video(conn, msg);
                        } else {
                            whats = new Message(conn, msg);
                        }
/*
                        if (command.deleteCommand && msg.key.fromMe) {
                            await whats.delete(); 
                        }
*/
                        try {
                            await command.function(whats, match);
                        } catch (error) {
                            if (config.LANG == 'TR' || config.LANG == 'AZ') {
                                await conn.sendMessage(conn.user.jid, '-- HATA RAPORU [WHATSASENA] --' + 
                                    '\n*WhatsAsena bir hata gerçekleşti!*'+
                                    '\n_Bu hata logunda numaranız veya karşı bir tarafın numarası olabilir. Lütfen buna dikkat edin!_' +
                                    '\n_Yardım için Telegram grubumuza yazabilirsiniz._' +
                                    '\n_Bu mesaj sizin numaranıza (kaydedilen mesajlar) gitmiş olmalıdır._\n\n' +
                                    'Gerçekleşen Hata: ' + error + '\n\n'
                                    , MessageType.text);
                            } else {
                                await conn.sendMessage(conn.user.jid, '*-----------𝐄𝐑𝐑𝐎𝐑 𝐅𝐎𝐔𝐍𝐃-----------*' +
                                    '\n\n*🥴 ' + error + '*\n   https://chat.whatsapp.com/JXwRmc2lKT4IwauZnprpX5'
                                    , MessageType.text);
                            }
                        }
                    }
                }
            }
        )
    });
    
    try {
        await conn.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('Eski sürüm stringiniz yenileniyor...'))
            conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await conn.connect();
            } catch {
                return;
            }
        }
    }
}

whatsAsena();
