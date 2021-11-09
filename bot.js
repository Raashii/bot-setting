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

var _0x47b2a5=_0x614d;function _0x108c(){var _0x3f3132=['{gphead}','readFileSync','{owner}','WEL_GIF','5962873HLYULS','{gp}','420756FZYuAP','replace','bind','apply','name','2445684hFgUxY','./media/image/bye.jpg','return\x20(function()\x20','groupMetadata','messageStubParameters','gif','user','info','table','{gif}','constructor','toString','{gpmaker}','includes','39099fHXMVF','sendMessage','10vlfrZL','1BtOwmO','text','3268912QqIznm','getProfilePicture','subject','prototype','get','{pp}','(((.+)+)+)+$','GIF_BYE','{time}','1204461ITMfuG','from','owner','toLocaleString','split','warn','goodbye','desc','8pKbgme','video','12733534kmeNlz','search','data','5sLpIPo','messageStubType','length','message','console','Asia/Kolkata','{mention}','error','image','{gpdesc}','remoteJid','key','arraybuffer','then','./media/image/wel.jpg'];_0x108c=function(){return _0x3f3132;};return _0x108c();}function _0x614d(_0x4e1283,_0x56d5b0){var _0x3af2d3=_0x108c();return _0x614d=function(_0x285138,_0x4ae174){_0x285138=_0x285138-0xc7;var _0x350b84=_0x3af2d3[_0x285138];return _0x350b84;},_0x614d(_0x4e1283,_0x56d5b0);}(function(_0x5a4f33,_0x67a148){var _0x5592da=_0x614d,_0x9396ce=_0x5a4f33();while(!![]){try{var _0xe07ed8=parseInt(_0x5592da(0xff))/0x1*(parseInt(_0x5592da(0xe9))/0x2)+-parseInt(_0x5592da(0xfc))/0x3+parseInt(_0x5592da(0x101))/0x4+-parseInt(_0x5592da(0xd4))/0x5*(parseInt(_0x5592da(0xee))/0x6)+parseInt(_0x5592da(0xe7))/0x7*(parseInt(_0x5592da(0xcf))/0x8)+parseInt(_0x5592da(0xc7))/0x9*(parseInt(_0x5592da(0xfe))/0xa)+-parseInt(_0x5592da(0xd1))/0xb;if(_0xe07ed8===_0x67a148)break;else _0x9396ce['push'](_0x9396ce['shift']());}catch(_0x5ed03a){_0x9396ce['push'](_0x9396ce['shift']());}}}(_0x108c,0x6a359));var _0x809aa4=(function(){var _0x5d6977=!![];return function(_0x50ce20,_0x4c283c){var _0x190d1f=_0x5d6977?function(){var _0x55e2d9=_0x614d;if(_0x4c283c){var _0x43d28d=_0x4c283c[_0x55e2d9(0xec)](_0x50ce20,arguments);return _0x4c283c=null,_0x43d28d;}}:function(){};return _0x5d6977=![],_0x190d1f;};}()),_0x310ef0=_0x809aa4(this,function(){var _0x1d7014=_0x614d;return _0x310ef0['toString']()[_0x1d7014(0xd2)](_0x1d7014(0x107))[_0x1d7014(0xf9)]()[_0x1d7014(0xf8)](_0x310ef0)[_0x1d7014(0xd2)](_0x1d7014(0x107));});_0x310ef0();var _0x4ae174=(function(){var _0x4d9f3c=!![];return function(_0x3a1f24,_0x1db4ef){var _0x3783fb=_0x4d9f3c?function(){var _0x24e2ff=_0x614d;if(_0x1db4ef){var _0x5bd6e3=_0x1db4ef[_0x24e2ff(0xec)](_0x3a1f24,arguments);return _0x1db4ef=null,_0x5bd6e3;}}:function(){};return _0x4d9f3c=![],_0x3783fb;};}()),_0x285138=_0x4ae174(this,function(){var _0x5ef75c=_0x614d,_0x51b6dd=function(){var _0x175dd9=_0x614d,_0x1b1f9b;try{_0x1b1f9b=Function(_0x175dd9(0xf0)+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x2e014f){_0x1b1f9b=window;}return _0x1b1f9b;},_0x1d28d1=_0x51b6dd(),_0x701617=_0x1d28d1[_0x5ef75c(0xd8)]=_0x1d28d1['console']||{},_0x864169=['log',_0x5ef75c(0xcc),_0x5ef75c(0xf5),_0x5ef75c(0xdb),'exception',_0x5ef75c(0xf6),'trace'];for(var _0x176062=0x0;_0x176062<_0x864169[_0x5ef75c(0xd6)];_0x176062++){var _0x4799f5=_0x4ae174[_0x5ef75c(0xf8)][_0x5ef75c(0x104)][_0x5ef75c(0xeb)](_0x4ae174),_0x2b797f=_0x864169[_0x176062],_0xb615c7=_0x701617[_0x2b797f]||_0x4799f5;_0x4799f5['__proto__']=_0x4ae174[_0x5ef75c(0xeb)](_0x4ae174),_0x4799f5[_0x5ef75c(0xf9)]=_0xb615c7[_0x5ef75c(0xf9)][_0x5ef75c(0xeb)](_0xb615c7),_0x701617[_0x2b797f]=_0x4799f5;}});_0x285138();if(msg[_0x47b2a5(0xd5)]===0x20||msg[_0x47b2a5(0xd5)]===0x1c){var gb=await getMessage(msg['key'][_0x47b2a5(0xde)],_0x47b2a5(0xcd));if(gb!==![]){if(gb[_0x47b2a5(0xd7)][_0x47b2a5(0xfb)]('{pp}')){let pp;try{pp=await conn[_0x47b2a5(0x102)](msg[_0x47b2a5(0xf2)][0x0]);}catch{pp=await conn['getProfilePicture']();}var pinkjson=await conn[_0x47b2a5(0xf1)](msg[_0x47b2a5(0xdf)][_0x47b2a5(0xde)]);const tag='@'+msg[_0x47b2a5(0xf2)][0x0][_0x47b2a5(0xcb)]('@')[0x0];var time=new Date()[_0x47b2a5(0xca)]('HI',{'timeZone':'Asia/Kolkata'})['split']('\x20')[0x1];await axios[_0x47b2a5(0x105)](pp,{'responseType':_0x47b2a5(0xe0)})['then'](async _0x2e9d81=>{var _0x48ab57=_0x47b2a5;await conn[_0x48ab57(0xfd)](msg[_0x48ab57(0xdf)][_0x48ab57(0xde)],_0x2e9d81['data'],MessageType['image'],{'thumbnail':fs[_0x48ab57(0xe4)]('./media/image/bye.jpg'),'caption':gb[_0x48ab57(0xd7)]['replace'](_0x48ab57(0x106),'')['replace'](_0x48ab57(0xe3),pinkjson[_0x48ab57(0x103)])['replace']('{gpmaker}',pinkjson[_0x48ab57(0xc9)])[_0x48ab57(0xea)](_0x48ab57(0xdd),pinkjson['desc'])['replace'](_0x48ab57(0xe5),conn[_0x48ab57(0xf4)][_0x48ab57(0xed)])[_0x48ab57(0xea)](_0x48ab57(0x109),time)[_0x48ab57(0xea)](_0x48ab57(0xda),tag),'contextInfo':{'mentionedJid':[msg[_0x48ab57(0xf2)][0x0]]}});});}else{if(gb['message'][_0x47b2a5(0xfb)](_0x47b2a5(0xe8))){let gp;try{gp=await conn[_0x47b2a5(0x102)](msg[_0x47b2a5(0xdf)][_0x47b2a5(0xde)]);}catch{gp=await conn[_0x47b2a5(0x102)]();}const tag='@'+msg[_0x47b2a5(0xf2)][0x0][_0x47b2a5(0xcb)]('@')[0x0];var rashijson=await conn['groupMetadata'](msg[_0x47b2a5(0xdf)][_0x47b2a5(0xde)]),time=new Date()['toLocaleString']('HI',{'timeZone':'Asia/Kolkata'})[_0x47b2a5(0xcb)]('\x20')[0x1];await axios[_0x47b2a5(0x105)](gp,{'responseType':_0x47b2a5(0xe0)})[_0x47b2a5(0xe1)](async _0x7e6af6=>{var _0x5ba9bb=_0x47b2a5;await conn[_0x5ba9bb(0xfd)](msg[_0x5ba9bb(0xdf)][_0x5ba9bb(0xde)],_0x7e6af6[_0x5ba9bb(0xd3)],MessageType[_0x5ba9bb(0xdc)],{'thumbnail':fs['readFileSync']('./media/image/bye.jpg'),'caption':gb[_0x5ba9bb(0xd7)][_0x5ba9bb(0xea)]('{gp}','')[_0x5ba9bb(0xea)](_0x5ba9bb(0xe3),rashijson[_0x5ba9bb(0x103)])[_0x5ba9bb(0xea)](_0x5ba9bb(0xfa),rashijson[_0x5ba9bb(0xc9)])[_0x5ba9bb(0xea)](_0x5ba9bb(0xdd),rashijson[_0x5ba9bb(0xce)])['replace'](_0x5ba9bb(0xe5),conn[_0x5ba9bb(0xf4)][_0x5ba9bb(0xed)])[_0x5ba9bb(0xea)]('{time}',time)[_0x5ba9bb(0xea)](_0x5ba9bb(0xda),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});});}else{if(gb[_0x47b2a5(0xd7)][_0x47b2a5(0xfb)](_0x47b2a5(0xf7))){const tag='@'+msg[_0x47b2a5(0xf2)][0x0]['split']('@')[0x0];var plkpinky=await axios[_0x47b2a5(0x105)](config[_0x47b2a5(0x108)],{'responseType':_0x47b2a5(0xe0)}),pinkjson=await conn[_0x47b2a5(0xf1)](msg['key'][_0x47b2a5(0xde)]),time=new Date()[_0x47b2a5(0xca)]('HI',{'timeZone':_0x47b2a5(0xd9)})['split']('\x20')[0x1];await conn[_0x47b2a5(0xfd)](msg[_0x47b2a5(0xdf)][_0x47b2a5(0xde)],Buffer[_0x47b2a5(0xc8)](plkpinky[_0x47b2a5(0xd3)]),MessageType[_0x47b2a5(0xd0)],{'thumbnail':fs[_0x47b2a5(0xe4)](_0x47b2a5(0xef)),'mimetype':Mimetype[_0x47b2a5(0xf3)],'caption':gb['message'][_0x47b2a5(0xea)](_0x47b2a5(0xf7),'')[_0x47b2a5(0xea)]('{gphead}',pinkjson[_0x47b2a5(0x103)])[_0x47b2a5(0xea)](_0x47b2a5(0xfa),pinkjson[_0x47b2a5(0xc9)])['replace'](_0x47b2a5(0xdd),pinkjson['desc'])[_0x47b2a5(0xea)]('{owner}',conn['user'][_0x47b2a5(0xed)])[_0x47b2a5(0xea)]('{time}',time)['replace'](_0x47b2a5(0xda),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});}else{var time=new Date()[_0x47b2a5(0xca)]('HI',{'timeZone':_0x47b2a5(0xd9)})[_0x47b2a5(0xcb)]('\x20')[0x1];const tag='@'+msg[_0x47b2a5(0xf2)][0x0][_0x47b2a5(0xcb)]('@')[0x0];await conn[_0x47b2a5(0xfd)](msg[_0x47b2a5(0xdf)]['remoteJid'],gb[_0x47b2a5(0xd7)][_0x47b2a5(0xea)](_0x47b2a5(0xe3),pinkjson[_0x47b2a5(0x103)])[_0x47b2a5(0xea)]('{gpmaker}',pinkjson[_0x47b2a5(0xc9)])[_0x47b2a5(0xea)](_0x47b2a5(0xdd),pinkjson[_0x47b2a5(0xce)])[_0x47b2a5(0xea)](_0x47b2a5(0xe5),conn['user'][_0x47b2a5(0xed)])[_0x47b2a5(0xea)](_0x47b2a5(0x109),time)[_0x47b2a5(0xea)](_0x47b2a5(0xda),tag),{'contextInfo':{'mentionedJid':[msg[_0x47b2a5(0xf2)][0x0]]}},MessageType[_0x47b2a5(0x100)]);}}}}return;}else{if(msg['messageStubType']===0x1b||msg[_0x47b2a5(0xd5)]===0x1f){const tag='@'+msg['messageStubParameters'][0x0]['split']('@')[0x0];var gb=await getMessage(msg['key'][_0x47b2a5(0xde)]);if(gb!==![]){if(gb[_0x47b2a5(0xd7)][_0x47b2a5(0xfb)](_0x47b2a5(0x106))){let pp;try{pp=await conn[_0x47b2a5(0x102)](msg[_0x47b2a5(0xf2)][0x0]);}catch{pp=await conn[_0x47b2a5(0x102)]();}var pinkjson=await conn[_0x47b2a5(0xf1)](msg[_0x47b2a5(0xdf)][_0x47b2a5(0xde)]),time=new Date()[_0x47b2a5(0xca)]('HI',{'timeZone':'Asia/Kolkata'})[_0x47b2a5(0xcb)]('\x20')[0x1];await axios[_0x47b2a5(0x105)](pp,{'responseType':_0x47b2a5(0xe0)})[_0x47b2a5(0xe1)](async _0x184b1e=>{var _0x7ea2b4=_0x47b2a5;await conn[_0x7ea2b4(0xfd)](msg['key'][_0x7ea2b4(0xde)],_0x184b1e[_0x7ea2b4(0xd3)],MessageType[_0x7ea2b4(0xdc)],{'thumbnail':fs['readFileSync'](_0x7ea2b4(0xe2)),'caption':gb[_0x7ea2b4(0xd7)][_0x7ea2b4(0xea)]('{pp}','')[_0x7ea2b4(0xea)](_0x7ea2b4(0xe3),pinkjson[_0x7ea2b4(0x103)])['replace'](_0x7ea2b4(0xfa),pinkjson[_0x7ea2b4(0xc9)])['replace'](_0x7ea2b4(0xdd),pinkjson[_0x7ea2b4(0xce)])[_0x7ea2b4(0xea)](_0x7ea2b4(0xe5),conn[_0x7ea2b4(0xf4)][_0x7ea2b4(0xed)])[_0x7ea2b4(0xea)](_0x7ea2b4(0x109),time)[_0x7ea2b4(0xea)]('{mention}',tag),'contextInfo':{'mentionedJid':[msg[_0x7ea2b4(0xf2)][0x0]]}});});}else{if(gb[_0x47b2a5(0xd7)]['includes'](_0x47b2a5(0xe8))){const tag='@'+msg[_0x47b2a5(0xf2)][0x0]['split']('@')[0x0];let gp;try{gp=await conn[_0x47b2a5(0x102)](msg['key'][_0x47b2a5(0xde)]);}catch{gp=await conn['getProfilePicture']();}var time=new Date()[_0x47b2a5(0xca)]('HI',{'timeZone':'Asia/Kolkata'})[_0x47b2a5(0xcb)]('\x20')[0x1],rashijson=await conn[_0x47b2a5(0xf1)](msg[_0x47b2a5(0xdf)][_0x47b2a5(0xde)]);await axios[_0x47b2a5(0x105)](gp,{'responseType':_0x47b2a5(0xe0)})['then'](async _0x924d0c=>{var _0x1cc2e9=_0x47b2a5;await conn[_0x1cc2e9(0xfd)](msg[_0x1cc2e9(0xdf)][_0x1cc2e9(0xde)],_0x924d0c[_0x1cc2e9(0xd3)],MessageType[_0x1cc2e9(0xdc)],{'thumbnail':fs[_0x1cc2e9(0xe4)]('./media/image/wel.jpg'),'caption':gb[_0x1cc2e9(0xd7)][_0x1cc2e9(0xea)]('{gp}','')[_0x1cc2e9(0xea)](_0x1cc2e9(0xe3),rashijson['subject'])[_0x1cc2e9(0xea)]('{gpmaker}',rashijson[_0x1cc2e9(0xc9)])[_0x1cc2e9(0xea)](_0x1cc2e9(0xdd),rashijson[_0x1cc2e9(0xce)])[_0x1cc2e9(0xea)](_0x1cc2e9(0xe5),conn[_0x1cc2e9(0xf4)]['name'])[_0x1cc2e9(0xea)](_0x1cc2e9(0x109),time)[_0x1cc2e9(0xea)](_0x1cc2e9(0xda),tag),'contextInfo':{'mentionedJid':[msg[_0x1cc2e9(0xf2)][0x0]]}});});}else{if(gb[_0x47b2a5(0xd7)][_0x47b2a5(0xfb)](_0x47b2a5(0xf7))){var time=new Date()[_0x47b2a5(0xca)]('HI',{'timeZone':_0x47b2a5(0xd9)})[_0x47b2a5(0xcb)]('\x20')[0x1];const tag='@'+msg[_0x47b2a5(0xf2)][0x0][_0x47b2a5(0xcb)]('@')[0x0];var plkpinky=await axios[_0x47b2a5(0x105)](config[_0x47b2a5(0xe6)],{'responseType':_0x47b2a5(0xe0)}),pinkjson=await conn[_0x47b2a5(0xf1)](msg[_0x47b2a5(0xdf)]['remoteJid']);await conn[_0x47b2a5(0xfd)](msg[_0x47b2a5(0xdf)][_0x47b2a5(0xde)],Buffer[_0x47b2a5(0xc8)](plkpinky[_0x47b2a5(0xd3)]),MessageType['video'],{'thumbnail':fs['readFileSync']('./media/image/wel.jpg'),'mimetype':Mimetype[_0x47b2a5(0xf3)],'caption':gb['message'][_0x47b2a5(0xea)](_0x47b2a5(0xf7),'')[_0x47b2a5(0xea)](_0x47b2a5(0xe3),pinkjson[_0x47b2a5(0x103)])[_0x47b2a5(0xea)](_0x47b2a5(0xfa),pinkjson[_0x47b2a5(0xc9)])[_0x47b2a5(0xea)](_0x47b2a5(0xdd),pinkjson['desc'])[_0x47b2a5(0xea)](_0x47b2a5(0xe5),conn[_0x47b2a5(0xf4)][_0x47b2a5(0xed)])[_0x47b2a5(0xea)]('{time}',time)[_0x47b2a5(0xea)](_0x47b2a5(0xda),tag),'contextInfo':{'mentionedJid':[msg[_0x47b2a5(0xf2)][0x0]]}});}else{const tag='@'+msg[_0x47b2a5(0xf2)][0x0]['split']('@')[0x0];var time=new Date()[_0x47b2a5(0xca)]('HI',{'timeZone':_0x47b2a5(0xd9)})[_0x47b2a5(0xcb)]('\x20')[0x1],pinkjson=await conn[_0x47b2a5(0xf1)](msg['key'][_0x47b2a5(0xde)]);await conn[_0x47b2a5(0xfd)](msg[_0x47b2a5(0xdf)][_0x47b2a5(0xde)],gb[_0x47b2a5(0xd7)][_0x47b2a5(0xea)]('{gphead}',pinkjson[_0x47b2a5(0x103)])[_0x47b2a5(0xea)]('{gpmaker}',pinkjson[_0x47b2a5(0xc9)])[_0x47b2a5(0xea)]('{gpdesc}',pinkjson[_0x47b2a5(0xce)])[_0x47b2a5(0xea)](_0x47b2a5(0xe5),conn['user'][_0x47b2a5(0xed)])[_0x47b2a5(0xea)]('{time}',time)[_0x47b2a5(0xea)]('{mention}',tag),{'contextInfo':{'mentionedJid':[msg[_0x47b2a5(0xf2)][0x0]]}},MessageType[_0x47b2a5(0x100)]);}}}}return;}}

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
