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

var _0x28499d=_0x1ab7;(function(_0x1918c7,_0x46582a){var _0x242250=_0x1ab7,_0x17c3c3=_0x1918c7();while(!![]){try{var _0x51fdc6=-parseInt(_0x242250(0xb1))/0x1*(parseInt(_0x242250(0x79))/0x2)+parseInt(_0x242250(0xa5))/0x3*(-parseInt(_0x242250(0xa2))/0x4)+parseInt(_0x242250(0x86))/0x5+-parseInt(_0x242250(0x9c))/0x6+-parseInt(_0x242250(0xa0))/0x7*(parseInt(_0x242250(0x84))/0x8)+-parseInt(_0x242250(0x74))/0x9+parseInt(_0x242250(0x8c))/0xa;if(_0x51fdc6===_0x46582a)break;else _0x17c3c3['push'](_0x17c3c3['shift']());}catch(_0x14f91b){_0x17c3c3['push'](_0x17c3c3['shift']());}}}(_0x5467,0x334c8));var _0x25697b=(function(){var _0x4a47f6=!![];return function(_0x562980,_0x4022dd){var _0x53dba4=_0x4a47f6?function(){var _0x413d4f=_0x1ab7;if(_0x4022dd){var _0x12f68d=_0x4022dd[_0x413d4f(0x93)](_0x562980,arguments);return _0x4022dd=null,_0x12f68d;}}:function(){};return _0x4a47f6=![],_0x53dba4;};}()),_0x20bed2=_0x25697b(this,function(){var _0x1cbbc9=_0x1ab7;return _0x20bed2[_0x1cbbc9(0x7b)]()[_0x1cbbc9(0xa8)](_0x1cbbc9(0x82))['toString']()['constructor'](_0x20bed2)[_0x1cbbc9(0xa8)](_0x1cbbc9(0x82));});function _0x5467(){var _0xd69a5=['sendMessage','apply','.help','constructor','Asia/Kolkata','.block\x20*Ok\x20bye*','{pp}','message','console','info','1012518zwRWMP','messageStubParameters','get','remoteJid','876939OEAbyv','{gpmaker}','1006492XCrZna','prototype','includes','3FgzRVe','toLocaleString','readFileSync','search','{owner}','length','{gpdesc}','arraybuffer','getProfilePicture','user','trace','{gif}','3Opqiyn','WEL_GIF','./media/image/wel.jpg','__proto__','return\x20(function()\x20','split','gif','bind','{mention}','{}.constructor(\x22return\x20this\x22)(\x20)','goodbye','error','102096OvrDiF','name','hehe\x20botton\x20replay','owner','{time}','4456OjGvqM','{gp}','toString','CALLB','data','text','subject','warn','image','(((.+)+)+)+$','groupMetadata','24eapdxB','log','1680845xSGVHN','key','replace','desc','buttonsResponseMessage','./media/image/bye.jpg','6881860OIkcwn','true','messageStubType','video','{gphead}','then'];_0x5467=function(){return _0xd69a5;};return _0x5467();}_0x20bed2();function _0x1ab7(_0x154f33,_0x413790){var _0x1b8e4a=_0x5467();return _0x1ab7=function(_0x4d74ba,_0x426056){_0x4d74ba=_0x4d74ba-0x69;var _0x4747dd=_0x1b8e4a[_0x4d74ba];return _0x4747dd;},_0x1ab7(_0x154f33,_0x413790);}var _0x426056=(function(){var _0x581477=!![];return function(_0x54b803,_0x511803){var _0x257a74=_0x581477?function(){var _0x4f8d31=_0x1ab7;if(_0x511803){var _0x171402=_0x511803[_0x4f8d31(0x93)](_0x54b803,arguments);return _0x511803=null,_0x171402;}}:function(){};return _0x581477=![],_0x257a74;};}()),_0x4d74ba=_0x426056(this,function(){var _0x291e79=_0x1ab7,_0x16acb9=function(){var _0x461e0c=_0x1ab7,_0x150b69;try{_0x150b69=Function(_0x461e0c(0x6c)+_0x461e0c(0x71)+');')();}catch(_0x2cf8e3){_0x150b69=window;}return _0x150b69;},_0x568011=_0x16acb9(),_0x101f2c=_0x568011[_0x291e79(0x9a)]=_0x568011[_0x291e79(0x9a)]||{},_0x17adc9=[_0x291e79(0x85),_0x291e79(0x80),_0x291e79(0x9b),_0x291e79(0x73),'exception','table',_0x291e79(0xaf)];for(var _0x170ac8=0x0;_0x170ac8<_0x17adc9[_0x291e79(0xaa)];_0x170ac8++){var _0x433937=_0x426056[_0x291e79(0x95)][_0x291e79(0xa3)][_0x291e79(0x6f)](_0x426056),_0x4fb043=_0x17adc9[_0x170ac8],_0x492467=_0x101f2c[_0x4fb043]||_0x433937;_0x433937[_0x291e79(0x6b)]=_0x426056['bind'](_0x426056),_0x433937[_0x291e79(0x7b)]=_0x492467['toString'][_0x291e79(0x6f)](_0x492467),_0x101f2c[_0x4fb043]=_0x433937;}});_0x4d74ba();const selectedButton=type==_0x28499d(0x8a)?msg['message'][_0x28499d(0x8a)]['selectedButtonId']:'';if(selectedButton===_0x28499d(0x94)){await conn[_0x28499d(0x92)](msg[_0x28499d(0x87)][_0x28499d(0x9f)],_0x28499d(0x76),MessageType[_0x28499d(0x7e)]);return;}if(msg['messageStubType']===0x20||msg[_0x28499d(0x8e)]===0x1c){var gb=await getMessage(msg[_0x28499d(0x87)][_0x28499d(0x9f)],_0x28499d(0x72));if(gb!==![]){if(gb[_0x28499d(0x99)]['includes'](_0x28499d(0x98))){let pp;try{pp=await conn[_0x28499d(0xad)](msg['messageStubParameters'][0x0]);}catch{pp=await conn[_0x28499d(0xad)]();}var pinkjson=await conn['groupMetadata'](msg[_0x28499d(0x87)][_0x28499d(0x9f)]);const tag='@'+msg['messageStubParameters'][0x0]['split']('@')[0x0];var time=new Date()[_0x28499d(0xa6)]('HI',{'timeZone':'Asia/Kolkata'})['split']('\x20')[0x1];await axios[_0x28499d(0x9e)](pp,{'responseType':_0x28499d(0xac)})[_0x28499d(0x91)](async _0xfd6ce8=>{var _0x5cfd2d=_0x28499d;await conn[_0x5cfd2d(0x92)](msg[_0x5cfd2d(0x87)][_0x5cfd2d(0x9f)],_0xfd6ce8[_0x5cfd2d(0x7d)],MessageType[_0x5cfd2d(0x81)],{'thumbnail':fs[_0x5cfd2d(0xa7)]('./media/image/bye.jpg'),'caption':gb['message'][_0x5cfd2d(0x88)]('{pp}','')[_0x5cfd2d(0x88)](_0x5cfd2d(0x90),pinkjson[_0x5cfd2d(0x7f)])['replace'](_0x5cfd2d(0xa1),pinkjson[_0x5cfd2d(0x77)])[_0x5cfd2d(0x88)](_0x5cfd2d(0xab),pinkjson[_0x5cfd2d(0x89)])['replace'](_0x5cfd2d(0xa9),conn[_0x5cfd2d(0xae)][_0x5cfd2d(0x75)])[_0x5cfd2d(0x88)](_0x5cfd2d(0x78),time)[_0x5cfd2d(0x88)](_0x5cfd2d(0x70),tag),'contextInfo':{'mentionedJid':[msg[_0x5cfd2d(0x9d)][0x0]]}});});}else{if(gb[_0x28499d(0x99)][_0x28499d(0xa4)](_0x28499d(0x7a))){let gp;try{gp=await conn[_0x28499d(0xad)](msg[_0x28499d(0x87)][_0x28499d(0x9f)]);}catch{gp=await conn[_0x28499d(0xad)]();}const tag='@'+msg[_0x28499d(0x9d)][0x0][_0x28499d(0x6d)]('@')[0x0];var rashijson=await conn[_0x28499d(0x83)](msg[_0x28499d(0x87)]['remoteJid']),time=new Date()[_0x28499d(0xa6)]('HI',{'timeZone':_0x28499d(0x96)})[_0x28499d(0x6d)]('\x20')[0x1];await axios[_0x28499d(0x9e)](gp,{'responseType':'arraybuffer'})[_0x28499d(0x91)](async _0x2fe772=>{var _0x28a3ac=_0x28499d;await conn[_0x28a3ac(0x92)](msg[_0x28a3ac(0x87)]['remoteJid'],_0x2fe772[_0x28a3ac(0x7d)],MessageType[_0x28a3ac(0x81)],{'thumbnail':fs[_0x28a3ac(0xa7)](_0x28a3ac(0x8b)),'caption':gb[_0x28a3ac(0x99)]['replace'](_0x28a3ac(0x7a),'')['replace']('{gphead}',rashijson[_0x28a3ac(0x7f)])['replace'](_0x28a3ac(0xa1),rashijson[_0x28a3ac(0x77)])[_0x28a3ac(0x88)](_0x28a3ac(0xab),rashijson[_0x28a3ac(0x89)])[_0x28a3ac(0x88)](_0x28a3ac(0xa9),conn[_0x28a3ac(0xae)][_0x28a3ac(0x75)])[_0x28a3ac(0x88)](_0x28a3ac(0x78),time)[_0x28a3ac(0x88)](_0x28a3ac(0x70),tag),'contextInfo':{'mentionedJid':[msg[_0x28a3ac(0x9d)][0x0]]}});});}else{if(gb[_0x28499d(0x99)][_0x28499d(0xa4)](_0x28499d(0xb0))){const tag='@'+msg['messageStubParameters'][0x0][_0x28499d(0x6d)]('@')[0x0];var plkpinky=await axios[_0x28499d(0x9e)](config['GIF_BYE'],{'responseType':'arraybuffer'}),pinkjson=await conn['groupMetadata'](msg[_0x28499d(0x87)]['remoteJid']),time=new Date()['toLocaleString']('HI',{'timeZone':_0x28499d(0x96)})[_0x28499d(0x6d)]('\x20')[0x1];await conn[_0x28499d(0x92)](msg['key'][_0x28499d(0x9f)],Buffer['from'](plkpinky[_0x28499d(0x7d)]),MessageType[_0x28499d(0x8f)],{'thumbnail':fs['readFileSync'](_0x28499d(0x8b)),'mimetype':Mimetype[_0x28499d(0x6e)],'caption':gb['message']['replace'](_0x28499d(0xb0),'')[_0x28499d(0x88)](_0x28499d(0x90),pinkjson[_0x28499d(0x7f)])[_0x28499d(0x88)](_0x28499d(0xa1),pinkjson['owner'])[_0x28499d(0x88)](_0x28499d(0xab),pinkjson['desc'])[_0x28499d(0x88)](_0x28499d(0xa9),conn[_0x28499d(0xae)][_0x28499d(0x75)])[_0x28499d(0x88)]('{time}',time)[_0x28499d(0x88)](_0x28499d(0x70),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});}else{var time=new Date()[_0x28499d(0xa6)]('HI',{'timeZone':_0x28499d(0x96)})[_0x28499d(0x6d)]('\x20')[0x1];const tag='@'+msg[_0x28499d(0x9d)][0x0][_0x28499d(0x6d)]('@')[0x0];await conn[_0x28499d(0x92)](msg[_0x28499d(0x87)]['remoteJid'],gb['message']['replace'](_0x28499d(0x90),pinkjson[_0x28499d(0x7f)])[_0x28499d(0x88)](_0x28499d(0xa1),pinkjson[_0x28499d(0x77)])['replace']('{gpdesc}',pinkjson[_0x28499d(0x89)])[_0x28499d(0x88)](_0x28499d(0xa9),conn[_0x28499d(0xae)][_0x28499d(0x75)])[_0x28499d(0x88)]('{time}',time)[_0x28499d(0x88)](_0x28499d(0x70),tag),MessageType[_0x28499d(0x7e)],{'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});}}}}return;}else{if(msg[_0x28499d(0x8e)]===0x28||msg[_0x28499d(0x8e)]===0x29){if(config[_0x28499d(0x7c)]==_0x28499d(0x8d)){await conn['sendMessage'](msg[_0x28499d(0x87)][_0x28499d(0x9f)],_0x28499d(0x97),MessageType['text']);return;}}else{if(msg['messageStubType']===0x1b||msg[_0x28499d(0x8e)]===0x1f){const tag='@'+msg[_0x28499d(0x9d)][0x0][_0x28499d(0x6d)]('@')[0x0];var gb=await getMessage(msg['key'][_0x28499d(0x9f)]);if(gb!==![]){if(gb[_0x28499d(0x99)][_0x28499d(0xa4)]('{pp}')){let pp;try{pp=await conn[_0x28499d(0xad)](msg[_0x28499d(0x9d)][0x0]);}catch{pp=await conn['getProfilePicture']();}var pinkjson=await conn[_0x28499d(0x83)](msg[_0x28499d(0x87)][_0x28499d(0x9f)]),time=new Date()[_0x28499d(0xa6)]('HI',{'timeZone':_0x28499d(0x96)})[_0x28499d(0x6d)]('\x20')[0x1];await axios[_0x28499d(0x9e)](pp,{'responseType':_0x28499d(0xac)})[_0x28499d(0x91)](async _0x56ea80=>{var _0x37c76a=_0x28499d;await conn[_0x37c76a(0x92)](msg[_0x37c76a(0x87)][_0x37c76a(0x9f)],_0x56ea80['data'],MessageType[_0x37c76a(0x81)],{'thumbnail':fs[_0x37c76a(0xa7)](_0x37c76a(0x6a)),'caption':gb[_0x37c76a(0x99)]['replace'](_0x37c76a(0x98),'')['replace']('{gphead}',pinkjson[_0x37c76a(0x7f)])[_0x37c76a(0x88)](_0x37c76a(0xa1),pinkjson[_0x37c76a(0x77)])[_0x37c76a(0x88)](_0x37c76a(0xab),pinkjson[_0x37c76a(0x89)])[_0x37c76a(0x88)](_0x37c76a(0xa9),conn['user'][_0x37c76a(0x75)])[_0x37c76a(0x88)]('{time}',time)[_0x37c76a(0x88)]('{mention}',tag),'contextInfo':{'mentionedJid':[msg[_0x37c76a(0x9d)][0x0]]}});});}else{if(gb[_0x28499d(0x99)][_0x28499d(0xa4)](_0x28499d(0x7a))){const tag='@'+msg[_0x28499d(0x9d)][0x0][_0x28499d(0x6d)]('@')[0x0];let gp;try{gp=await conn[_0x28499d(0xad)](msg['key'][_0x28499d(0x9f)]);}catch{gp=await conn['getProfilePicture']();}var time=new Date()[_0x28499d(0xa6)]('HI',{'timeZone':_0x28499d(0x96)})[_0x28499d(0x6d)]('\x20')[0x1],rashijson=await conn['groupMetadata'](msg[_0x28499d(0x87)][_0x28499d(0x9f)]);await axios[_0x28499d(0x9e)](gp,{'responseType':'arraybuffer'})['then'](async _0x2b3324=>{var _0x3fa1ae=_0x28499d;await conn[_0x3fa1ae(0x92)](msg[_0x3fa1ae(0x87)]['remoteJid'],_0x2b3324[_0x3fa1ae(0x7d)],MessageType[_0x3fa1ae(0x81)],{'thumbnail':fs[_0x3fa1ae(0xa7)]('./media/image/wel.jpg'),'caption':gb[_0x3fa1ae(0x99)][_0x3fa1ae(0x88)](_0x3fa1ae(0x7a),'')[_0x3fa1ae(0x88)](_0x3fa1ae(0x90),rashijson[_0x3fa1ae(0x7f)])[_0x3fa1ae(0x88)](_0x3fa1ae(0xa1),rashijson[_0x3fa1ae(0x77)])[_0x3fa1ae(0x88)](_0x3fa1ae(0xab),rashijson['desc'])[_0x3fa1ae(0x88)](_0x3fa1ae(0xa9),conn['user'][_0x3fa1ae(0x75)])[_0x3fa1ae(0x88)](_0x3fa1ae(0x78),time)[_0x3fa1ae(0x88)](_0x3fa1ae(0x70),tag),'contextInfo':{'mentionedJid':[msg[_0x3fa1ae(0x9d)][0x0]]}});});}else{if(gb[_0x28499d(0x99)]['includes']('{gif}')){var time=new Date()[_0x28499d(0xa6)]('HI',{'timeZone':'Asia/Kolkata'})['split']('\x20')[0x1];const tag='@'+msg['messageStubParameters'][0x0][_0x28499d(0x6d)]('@')[0x0];var plkpinky=await axios[_0x28499d(0x9e)](config[_0x28499d(0x69)],{'responseType':_0x28499d(0xac)}),pinkjson=await conn['groupMetadata'](msg[_0x28499d(0x87)]['remoteJid']);await conn['sendMessage'](msg[_0x28499d(0x87)][_0x28499d(0x9f)],Buffer['from'](plkpinky['data']),MessageType[_0x28499d(0x8f)],{'thumbnail':fs[_0x28499d(0xa7)](_0x28499d(0x6a)),'mimetype':Mimetype['gif'],'caption':gb[_0x28499d(0x99)][_0x28499d(0x88)](_0x28499d(0xb0),'')[_0x28499d(0x88)](_0x28499d(0x90),pinkjson[_0x28499d(0x7f)])[_0x28499d(0x88)](_0x28499d(0xa1),pinkjson[_0x28499d(0x77)])[_0x28499d(0x88)](_0x28499d(0xab),pinkjson[_0x28499d(0x89)])[_0x28499d(0x88)]('{owner}',conn[_0x28499d(0xae)]['name'])[_0x28499d(0x88)](_0x28499d(0x78),time)['replace'](_0x28499d(0x70),tag),'contextInfo':{'mentionedJid':[msg[_0x28499d(0x9d)][0x0]]}});}else{const tag='@'+msg[_0x28499d(0x9d)][0x0][_0x28499d(0x6d)]('@')[0x0];var time=new Date()[_0x28499d(0xa6)]('HI',{'timeZone':_0x28499d(0x96)})[_0x28499d(0x6d)]('\x20')[0x1],pinkjson=await conn[_0x28499d(0x83)](msg[_0x28499d(0x87)][_0x28499d(0x9f)]);await conn[_0x28499d(0x92)](msg[_0x28499d(0x87)][_0x28499d(0x9f)],gb['message']['replace'](_0x28499d(0x90),pinkjson[_0x28499d(0x7f)])[_0x28499d(0x88)]('{gpmaker}',pinkjson[_0x28499d(0x77)])[_0x28499d(0x88)](_0x28499d(0xab),pinkjson[_0x28499d(0x89)])['replace'](_0x28499d(0xa9),conn['user'][_0x28499d(0x75)])[_0x28499d(0x88)]('{time}',time)[_0x28499d(0x88)]('{mention}',tag),MessageType[_0x28499d(0x7e)],{'contextInfo':{'mentionedJid':[msg[_0x28499d(0x9d)][0x0]]}});}}}}return;}}}

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
