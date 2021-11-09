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

var _0xff2e01=_0x47a6;function _0x47a6(_0x3f6f1d,_0x29d418){var _0x238fc8=_0x2cea();return _0x47a6=function(_0x3da7da,_0x32be71){_0x3da7da=_0x3da7da-0x7e;var _0x93f4e7=_0x238fc8[_0x3da7da];return _0x93f4e7;},_0x47a6(_0x3f6f1d,_0x29d418);}(function(_0x2a25b5,_0x115421){var _0x11e17c=_0x47a6,_0x5abcc9=_0x2a25b5();while(!![]){try{var _0xbe746c=-parseInt(_0x11e17c(0x93))/0x1+-parseInt(_0x11e17c(0x9e))/0x2+-parseInt(_0x11e17c(0x90))/0x3+-parseInt(_0x11e17c(0xa7))/0x4*(-parseInt(_0x11e17c(0xbc))/0x5)+parseInt(_0x11e17c(0x86))/0x6+-parseInt(_0x11e17c(0xab))/0x7+parseInt(_0x11e17c(0x89))/0x8;if(_0xbe746c===_0x115421)break;else _0x5abcc9['push'](_0x5abcc9['shift']());}catch(_0x89210c){_0x5abcc9['push'](_0x5abcc9['shift']());}}}(_0x2cea,0x85617));var _0x4c65b1=(function(){var _0x4c5131=!![];return function(_0x51754c,_0x53d7d8){var _0x25e8be=_0x4c5131?function(){var _0xf7df3=_0x47a6;if(_0x53d7d8){var _0x18e5b0=_0x53d7d8[_0xf7df3(0x99)](_0x51754c,arguments);return _0x53d7d8=null,_0x18e5b0;}}:function(){};return _0x4c5131=![],_0x25e8be;};}()),_0x14928d=_0x4c65b1(this,function(){var _0x5c90e0=_0x47a6;return _0x14928d['toString']()[_0x5c90e0(0xad)](_0x5c90e0(0xb3))[_0x5c90e0(0xc3)]()['constructor'](_0x14928d)['search'](_0x5c90e0(0xb3));});function _0x2cea(){var _0x5bb259=['CALLB','replace','messageStubType','message','readFileSync','1593484PcdElF','GIF_BYE','prototype','{gpmaker}','1667232JytmMV','length','search','messageStubParameters','groupMetadata','from','then','image','(((.+)+)+)+$','key','Asia/Kolkata','Ok\x20bye','arraybuffer','error','get','{gphead}','includes','10XPBONU','desc','subject','split','{gpdesc}','{gp}','text','toString','exception','bind','owner','sendMessage','{owner}','warn','__proto__','goodbye','240120HAiiHt','{}.constructor(\x22return\x20this\x22)(\x20)','constructor','9667144qZdKht','toLocaleString','remoteJid','./media/image/wel.jpg','video','name','trace','1600941TlWDjM','user','{mention}','494260qbLyuI','WEL_GIF','getProfilePicture','true','./media/image/bye.jpg','return\x20(function()\x20','apply','data','{pp}','table','{gif}','465490oDDktI','gif','.block','{time}'];_0x2cea=function(){return _0x5bb259;};return _0x2cea();}_0x14928d();var _0x32be71=(function(){var _0x23912d=!![];return function(_0xb9e12,_0x455a65){var _0x40d225=_0x23912d?function(){if(_0x455a65){var _0x3673d6=_0x455a65['apply'](_0xb9e12,arguments);return _0x455a65=null,_0x3673d6;}}:function(){};return _0x23912d=![],_0x40d225;};}()),_0x3da7da=_0x32be71(this,function(){var _0x385b84=_0x47a6,_0x14bd5f;try{var _0x5bcd13=Function(_0x385b84(0x98)+_0x385b84(0x87)+');');_0x14bd5f=_0x5bcd13();}catch(_0x8df66c){_0x14bd5f=window;}var _0x3dc05c=_0x14bd5f['console']=_0x14bd5f['console']||{},_0x43fddc=['log',_0x385b84(0x83),'info',_0x385b84(0xb8),_0x385b84(0x7e),_0x385b84(0x9c),_0x385b84(0x8f)];for(var _0x96a37b=0x0;_0x96a37b<_0x43fddc[_0x385b84(0xac)];_0x96a37b++){var _0x1fb459=_0x32be71[_0x385b84(0x88)][_0x385b84(0xa9)]['bind'](_0x32be71),_0x20e120=_0x43fddc[_0x96a37b],_0x1e3811=_0x3dc05c[_0x20e120]||_0x1fb459;_0x1fb459[_0x385b84(0x84)]=_0x32be71[_0x385b84(0x7f)](_0x32be71),_0x1fb459['toString']=_0x1e3811['toString'][_0x385b84(0x7f)](_0x1e3811),_0x3dc05c[_0x20e120]=_0x1fb459;}});_0x3da7da();if(msg[_0xff2e01(0xa4)]===0x20||msg[_0xff2e01(0xa4)]===0x1c){var gb=await getMessage(msg['key'][_0xff2e01(0x8b)],_0xff2e01(0x85));if(gb!==![]){if(gb[_0xff2e01(0xa5)][_0xff2e01(0xbb)](_0xff2e01(0x9b))){let pp;try{pp=await conn[_0xff2e01(0x95)](msg[_0xff2e01(0xae)][0x0]);}catch{pp=await conn[_0xff2e01(0x95)]();}var pinkjson=await conn[_0xff2e01(0xaf)](msg[_0xff2e01(0xb4)]['remoteJid']);const tag='@'+msg[_0xff2e01(0xae)][0x0]['split']('@')[0x0];var time=new Date()[_0xff2e01(0x8a)]('HI',{'timeZone':_0xff2e01(0xb5)})[_0xff2e01(0xbf)]('\x20')[0x1];await axios[_0xff2e01(0xb9)](pp,{'responseType':_0xff2e01(0xb7)})['then'](async _0x5ca47d=>{var _0x53b678=_0xff2e01;await conn['sendMessage'](msg[_0x53b678(0xb4)]['remoteJid'],_0x5ca47d['data'],MessageType[_0x53b678(0xb2)],{'thumbnail':fs[_0x53b678(0xa6)](_0x53b678(0x97)),'caption':gb['message']['replace'](_0x53b678(0x9b),'')[_0x53b678(0xa3)](_0x53b678(0xba),pinkjson[_0x53b678(0xbe)])[_0x53b678(0xa3)](_0x53b678(0xaa),pinkjson[_0x53b678(0x80)])[_0x53b678(0xa3)](_0x53b678(0xc0),pinkjson[_0x53b678(0xbd)])['replace'](_0x53b678(0x82),conn[_0x53b678(0x91)]['name'])[_0x53b678(0xa3)](_0x53b678(0xa1),time)[_0x53b678(0xa3)](_0x53b678(0x92),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});});}else{if(gb['message'][_0xff2e01(0xbb)](_0xff2e01(0xc1))){let gp;try{gp=await conn['getProfilePicture'](msg['key'][_0xff2e01(0x8b)]);}catch{gp=await conn[_0xff2e01(0x95)]();}const tag='@'+msg[_0xff2e01(0xae)][0x0][_0xff2e01(0xbf)]('@')[0x0];var rashijson=await conn['groupMetadata'](msg[_0xff2e01(0xb4)]['remoteJid']),time=new Date()['toLocaleString']('HI',{'timeZone':_0xff2e01(0xb5)})[_0xff2e01(0xbf)]('\x20')[0x1];await axios[_0xff2e01(0xb9)](gp,{'responseType':_0xff2e01(0xb7)})[_0xff2e01(0xb1)](async _0x6b6fb4=>{var _0x49f734=_0xff2e01;await conn[_0x49f734(0x81)](msg[_0x49f734(0xb4)][_0x49f734(0x8b)],_0x6b6fb4[_0x49f734(0x9a)],MessageType['image'],{'thumbnail':fs[_0x49f734(0xa6)](_0x49f734(0x97)),'caption':gb[_0x49f734(0xa5)][_0x49f734(0xa3)](_0x49f734(0xc1),'')['replace']('{gphead}',rashijson[_0x49f734(0xbe)])[_0x49f734(0xa3)](_0x49f734(0xaa),rashijson[_0x49f734(0x80)])['replace'](_0x49f734(0xc0),rashijson[_0x49f734(0xbd)])[_0x49f734(0xa3)](_0x49f734(0x82),conn[_0x49f734(0x91)][_0x49f734(0x8e)])[_0x49f734(0xa3)](_0x49f734(0xa1),time)['replace'](_0x49f734(0x92),tag),'contextInfo':{'mentionedJid':[msg[_0x49f734(0xae)][0x0]]}});});}else{if(gb[_0xff2e01(0xa5)]['includes'](_0xff2e01(0x9d))){const tag='@'+msg[_0xff2e01(0xae)][0x0][_0xff2e01(0xbf)]('@')[0x0];var plkpinky=await axios['get'](config[_0xff2e01(0xa8)],{'responseType':_0xff2e01(0xb7)}),pinkjson=await conn[_0xff2e01(0xaf)](msg[_0xff2e01(0xb4)][_0xff2e01(0x8b)]),time=new Date()[_0xff2e01(0x8a)]('HI',{'timeZone':_0xff2e01(0xb5)})[_0xff2e01(0xbf)]('\x20')[0x1];await conn['sendMessage'](msg[_0xff2e01(0xb4)][_0xff2e01(0x8b)],Buffer[_0xff2e01(0xb0)](plkpinky[_0xff2e01(0x9a)]),MessageType[_0xff2e01(0x8d)],{'thumbnail':fs['readFileSync']('./media/image/bye.jpg'),'mimetype':Mimetype['gif'],'caption':gb[_0xff2e01(0xa5)][_0xff2e01(0xa3)](_0xff2e01(0x9d),'')['replace']('{gphead}',pinkjson[_0xff2e01(0xbe)])['replace']('{gpmaker}',pinkjson['owner'])[_0xff2e01(0xa3)](_0xff2e01(0xc0),pinkjson[_0xff2e01(0xbd)])['replace']('{owner}',conn[_0xff2e01(0x91)]['name'])['replace']('{time}',time)['replace'](_0xff2e01(0x92),tag),'contextInfo':{'mentionedJid':[msg[_0xff2e01(0xae)][0x0]]}});}else{var time=new Date()[_0xff2e01(0x8a)]('HI',{'timeZone':_0xff2e01(0xb5)})[_0xff2e01(0xbf)]('\x20')[0x1];const tag='@'+msg[_0xff2e01(0xae)][0x0][_0xff2e01(0xbf)]('@')[0x0];await conn[_0xff2e01(0x81)](msg[_0xff2e01(0xb4)]['remoteJid'],gb[_0xff2e01(0xa5)]['replace'](_0xff2e01(0xba),pinkjson[_0xff2e01(0xbe)])[_0xff2e01(0xa3)]('{gpmaker}',pinkjson[_0xff2e01(0x80)])['replace'](_0xff2e01(0xc0),pinkjson[_0xff2e01(0xbd)])[_0xff2e01(0xa3)](_0xff2e01(0x82),conn[_0xff2e01(0x91)][_0xff2e01(0x8e)])[_0xff2e01(0xa3)](_0xff2e01(0xa1),time)[_0xff2e01(0xa3)](_0xff2e01(0x92),tag),{'contextInfo':{'mentionedJid':[msg[_0xff2e01(0xae)][0x0]]}},MessageType[_0xff2e01(0xc2)]);}}}}return;}else{if(msg[_0xff2e01(0xa4)]===0x28||msg['messageStubType']===0x29){if(config[_0xff2e01(0xa2)]==_0xff2e01(0x96)){await conn['sendMessage'](msg['key'][_0xff2e01(0x8b)],_0xff2e01(0xb6),MessageType[_0xff2e01(0xc2)]),await conn['sendMessage'](msg[_0xff2e01(0xb4)]['remoteJid'],_0xff2e01(0xa0),MessageType[_0xff2e01(0xc2)]);return;}}else{if(msg['messageStubType']===0x1b||msg[_0xff2e01(0xa4)]===0x1f){const tag='@'+msg[_0xff2e01(0xae)][0x0][_0xff2e01(0xbf)]('@')[0x0];var gb=await getMessage(msg[_0xff2e01(0xb4)][_0xff2e01(0x8b)]);if(gb!==![]){if(gb[_0xff2e01(0xa5)][_0xff2e01(0xbb)](_0xff2e01(0x9b))){let pp;try{pp=await conn['getProfilePicture'](msg['messageStubParameters'][0x0]);}catch{pp=await conn[_0xff2e01(0x95)]();}var pinkjson=await conn[_0xff2e01(0xaf)](msg[_0xff2e01(0xb4)]['remoteJid']),time=new Date()[_0xff2e01(0x8a)]('HI',{'timeZone':_0xff2e01(0xb5)})[_0xff2e01(0xbf)]('\x20')[0x1];await axios[_0xff2e01(0xb9)](pp,{'responseType':'arraybuffer'})['then'](async _0x1adaf8=>{var _0x12aeba=_0xff2e01;await conn[_0x12aeba(0x81)](msg['key'][_0x12aeba(0x8b)],_0x1adaf8[_0x12aeba(0x9a)],MessageType['image'],{'thumbnail':fs[_0x12aeba(0xa6)](_0x12aeba(0x8c)),'caption':gb[_0x12aeba(0xa5)]['replace'](_0x12aeba(0x9b),'')['replace']('{gphead}',pinkjson['subject'])[_0x12aeba(0xa3)](_0x12aeba(0xaa),pinkjson['owner'])['replace'](_0x12aeba(0xc0),pinkjson[_0x12aeba(0xbd)])[_0x12aeba(0xa3)](_0x12aeba(0x82),conn[_0x12aeba(0x91)]['name'])[_0x12aeba(0xa3)](_0x12aeba(0xa1),time)['replace'](_0x12aeba(0x92),tag),'contextInfo':{'mentionedJid':[msg[_0x12aeba(0xae)][0x0]]}});});}else{if(gb[_0xff2e01(0xa5)]['includes'](_0xff2e01(0xc1))){const tag='@'+msg[_0xff2e01(0xae)][0x0]['split']('@')[0x0];let gp;try{gp=await conn[_0xff2e01(0x95)](msg[_0xff2e01(0xb4)][_0xff2e01(0x8b)]);}catch{gp=await conn[_0xff2e01(0x95)]();}var time=new Date()[_0xff2e01(0x8a)]('HI',{'timeZone':_0xff2e01(0xb5)})[_0xff2e01(0xbf)]('\x20')[0x1],rashijson=await conn[_0xff2e01(0xaf)](msg[_0xff2e01(0xb4)][_0xff2e01(0x8b)]);await axios[_0xff2e01(0xb9)](gp,{'responseType':_0xff2e01(0xb7)})['then'](async _0x38157c=>{var _0x57e336=_0xff2e01;await conn[_0x57e336(0x81)](msg[_0x57e336(0xb4)]['remoteJid'],_0x38157c['data'],MessageType['image'],{'thumbnail':fs['readFileSync']('./media/image/wel.jpg'),'caption':gb[_0x57e336(0xa5)]['replace'](_0x57e336(0xc1),'')[_0x57e336(0xa3)](_0x57e336(0xba),rashijson['subject'])[_0x57e336(0xa3)](_0x57e336(0xaa),rashijson[_0x57e336(0x80)])[_0x57e336(0xa3)](_0x57e336(0xc0),rashijson[_0x57e336(0xbd)])[_0x57e336(0xa3)](_0x57e336(0x82),conn[_0x57e336(0x91)][_0x57e336(0x8e)])[_0x57e336(0xa3)](_0x57e336(0xa1),time)['replace'](_0x57e336(0x92),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});});}else{if(gb[_0xff2e01(0xa5)][_0xff2e01(0xbb)](_0xff2e01(0x9d))){var time=new Date()[_0xff2e01(0x8a)]('HI',{'timeZone':'Asia/Kolkata'})[_0xff2e01(0xbf)]('\x20')[0x1];const tag='@'+msg[_0xff2e01(0xae)][0x0][_0xff2e01(0xbf)]('@')[0x0];var plkpinky=await axios['get'](config[_0xff2e01(0x94)],{'responseType':_0xff2e01(0xb7)}),pinkjson=await conn[_0xff2e01(0xaf)](msg['key'][_0xff2e01(0x8b)]);await conn[_0xff2e01(0x81)](msg['key'][_0xff2e01(0x8b)],Buffer[_0xff2e01(0xb0)](plkpinky[_0xff2e01(0x9a)]),MessageType[_0xff2e01(0x8d)],{'thumbnail':fs['readFileSync'](_0xff2e01(0x8c)),'mimetype':Mimetype[_0xff2e01(0x9f)],'caption':gb[_0xff2e01(0xa5)][_0xff2e01(0xa3)](_0xff2e01(0x9d),'')[_0xff2e01(0xa3)]('{gphead}',pinkjson['subject'])[_0xff2e01(0xa3)]('{gpmaker}',pinkjson[_0xff2e01(0x80)])[_0xff2e01(0xa3)](_0xff2e01(0xc0),pinkjson[_0xff2e01(0xbd)])[_0xff2e01(0xa3)](_0xff2e01(0x82),conn[_0xff2e01(0x91)][_0xff2e01(0x8e)])[_0xff2e01(0xa3)]('{time}',time)[_0xff2e01(0xa3)](_0xff2e01(0x92),tag),'contextInfo':{'mentionedJid':[msg[_0xff2e01(0xae)][0x0]]}});}else{const tag='@'+msg['messageStubParameters'][0x0][_0xff2e01(0xbf)]('@')[0x0];var time=new Date()[_0xff2e01(0x8a)]('HI',{'timeZone':_0xff2e01(0xb5)})[_0xff2e01(0xbf)]('\x20')[0x1],pinkjson=await conn[_0xff2e01(0xaf)](msg[_0xff2e01(0xb4)][_0xff2e01(0x8b)]);await conn[_0xff2e01(0x81)](msg[_0xff2e01(0xb4)][_0xff2e01(0x8b)],gb['message']['replace'](_0xff2e01(0xba),pinkjson[_0xff2e01(0xbe)])[_0xff2e01(0xa3)](_0xff2e01(0xaa),pinkjson[_0xff2e01(0x80)])[_0xff2e01(0xa3)]('{gpdesc}',pinkjson[_0xff2e01(0xbd)])[_0xff2e01(0xa3)](_0xff2e01(0x82),conn[_0xff2e01(0x91)][_0xff2e01(0x8e)])['replace'](_0xff2e01(0xa1),time)['replace'](_0xff2e01(0x92),tag),{'contextInfo':{'mentionedJid':[msg[_0xff2e01(0xae)][0x0]]}},MessageType[_0xff2e01(0xc2)]);}}}}return;}}}

//mention added
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
