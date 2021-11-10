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

var _0x1d76d6=_0x4112;function _0xe13a(){var _0x4a9d6a=['(((.+)+)+)+$','info','./media/image/wel.jpg','36669200enyhCR','then','18UwUSSn','message','364054lFKpgm','remoteJid','length','{gif}','from','5270520aJBhQl','toLocaleString','desc','subject','trace','table','text','includes','data','get','{mention}','sendMessage','video','bind','prototype','return\x20(function()\x20','gif','key','messageStubType','split','true','console','groupMetadata','.block\x20*Ok\x20bye*','name','replace','./media/image/bye.jpg','1439837ARqSKb','arraybuffer','WEL_GIF','owner','Asia/Kolkata','exception','{pp}','log','{gp}','5951220zZfpru','user','53490VqHcpN','{gpdesc}','{gphead}','6392WlvbwW','{}.constructor(\x22return\x20this\x22)(\x20)','__proto__','{gpmaker}','{time}','525PWJCgs','constructor','apply','readFileSync','image','GIF_BYE','toString','messageStubParameters','{owner}','10215RGMLdo','getProfilePicture'];_0xe13a=function(){return _0x4a9d6a;};return _0xe13a();}function _0x4112(_0x40f1ec,_0x5128de){var _0xa74b52=_0xe13a();return _0x4112=function(_0x1440a7,_0x2a149a){_0x1440a7=_0x1440a7-0x1b3;var _0x48a799=_0xa74b52[_0x1440a7];return _0x48a799;},_0x4112(_0x40f1ec,_0x5128de);}(function(_0x39a2f6,_0x1a32ba){var _0xc10564=_0x4112,_0x36c8ce=_0x39a2f6();while(!![]){try{var _0x26e4a3=-parseInt(_0xc10564(0x1f3))/0x1+parseInt(_0xc10564(0x1d3))/0x2*(-parseInt(_0xc10564(0x1d1))/0x3)+-parseInt(_0xc10564(0x1d8))/0x4+parseInt(_0xc10564(0x1b7))/0x5+-parseInt(_0xc10564(0x1b9))/0x6*(-parseInt(_0xc10564(0x1c1))/0x7)+parseInt(_0xc10564(0x1bc))/0x8*(-parseInt(_0xc10564(0x1ca))/0x9)+parseInt(_0xc10564(0x1cf))/0xa;if(_0x26e4a3===_0x1a32ba)break;else _0x36c8ce['push'](_0x36c8ce['shift']());}catch(_0x483c33){_0x36c8ce['push'](_0x36c8ce['shift']());}}}(_0xe13a,0xbbd0f));var _0xd43ece=(function(){var _0x5cf058=!![];return function(_0xd9ac48,_0x28807e){var _0x25d39c=_0x5cf058?function(){var _0x7460fb=_0x4112;if(_0x28807e){var _0x15d947=_0x28807e[_0x7460fb(0x1c3)](_0xd9ac48,arguments);return _0x28807e=null,_0x15d947;}}:function(){};return _0x5cf058=![],_0x25d39c;};}()),_0x56ba1e=_0xd43ece(this,function(){var _0x18f07a=_0x4112;return _0x56ba1e['toString']()['search'](_0x18f07a(0x1cc))[_0x18f07a(0x1c7)]()[_0x18f07a(0x1c2)](_0x56ba1e)['search'](_0x18f07a(0x1cc));});_0x56ba1e();var _0x2a149a=(function(){var _0x15fa63=!![];return function(_0xa26d92,_0x1748d6){var _0x389f08=_0x15fa63?function(){var _0x3fb6f6=_0x4112;if(_0x1748d6){var _0xde1bfc=_0x1748d6[_0x3fb6f6(0x1c3)](_0xa26d92,arguments);return _0x1748d6=null,_0xde1bfc;}}:function(){};return _0x15fa63=![],_0x389f08;};}()),_0x1440a7=_0x2a149a(this,function(){var _0x3b58fd=_0x4112,_0x29be6d=function(){var _0x33dac4=_0x4112,_0x36cd80;try{_0x36cd80=Function(_0x33dac4(0x1e7)+_0x33dac4(0x1bd)+');')();}catch(_0x9d5f61){_0x36cd80=window;}return _0x36cd80;},_0x3195d6=_0x29be6d(),_0x535b10=_0x3195d6[_0x3b58fd(0x1ed)]=_0x3195d6[_0x3b58fd(0x1ed)]||{},_0x2d8daa=[_0x3b58fd(0x1b5),'warn',_0x3b58fd(0x1cd),'error',_0x3b58fd(0x1b3),_0x3b58fd(0x1dd),_0x3b58fd(0x1dc)];for(var _0x423f8c=0x0;_0x423f8c<_0x2d8daa[_0x3b58fd(0x1d5)];_0x423f8c++){var _0x21b991=_0x2a149a[_0x3b58fd(0x1c2)][_0x3b58fd(0x1e6)][_0x3b58fd(0x1e5)](_0x2a149a),_0x22cb5f=_0x2d8daa[_0x423f8c],_0x3d41cc=_0x535b10[_0x22cb5f]||_0x21b991;_0x21b991[_0x3b58fd(0x1be)]=_0x2a149a['bind'](_0x2a149a),_0x21b991[_0x3b58fd(0x1c7)]=_0x3d41cc[_0x3b58fd(0x1c7)]['bind'](_0x3d41cc),_0x535b10[_0x22cb5f]=_0x21b991;}});_0x1440a7();if(msg['messageStubType']===0x20||msg['messageStubType']===0x1c){var gb=await getMessage(msg[_0x1d76d6(0x1e9)][_0x1d76d6(0x1d4)],'goodbye');if(gb!==![]){if(gb[_0x1d76d6(0x1d2)][_0x1d76d6(0x1df)]('{pp}')){let pp;try{pp=await conn['getProfilePicture'](msg['messageStubParameters'][0x0]);}catch{pp=await conn[_0x1d76d6(0x1cb)]();}var pinkjson=await conn[_0x1d76d6(0x1ee)](msg[_0x1d76d6(0x1e9)]['remoteJid']);const tag='@'+msg[_0x1d76d6(0x1c8)][0x0][_0x1d76d6(0x1eb)]('@')[0x0];var time=new Date()[_0x1d76d6(0x1d9)]('HI',{'timeZone':_0x1d76d6(0x1f7)})['split']('\x20')[0x1];await axios[_0x1d76d6(0x1e1)](pp,{'responseType':_0x1d76d6(0x1f4)})[_0x1d76d6(0x1d0)](async _0x5818ee=>{var _0x237505=_0x1d76d6;await conn[_0x237505(0x1e3)](msg[_0x237505(0x1e9)][_0x237505(0x1d4)],_0x5818ee[_0x237505(0x1e0)],MessageType[_0x237505(0x1c5)],{'thumbnail':fs['readFileSync'](_0x237505(0x1f2)),'caption':gb['message']['replace'](_0x237505(0x1b4),'')['replace'](_0x237505(0x1bb),pinkjson[_0x237505(0x1db)])[_0x237505(0x1f1)](_0x237505(0x1bf),pinkjson[_0x237505(0x1f6)])['replace'](_0x237505(0x1ba),pinkjson['desc'])[_0x237505(0x1f1)](_0x237505(0x1c9),conn[_0x237505(0x1b8)]['name'])['replace'](_0x237505(0x1c0),time)[_0x237505(0x1f1)](_0x237505(0x1e2),tag),'contextInfo':{'mentionedJid':[msg[_0x237505(0x1c8)][0x0]]}});});}else{if(gb[_0x1d76d6(0x1d2)][_0x1d76d6(0x1df)](_0x1d76d6(0x1b6))){let gp;try{gp=await conn[_0x1d76d6(0x1cb)](msg[_0x1d76d6(0x1e9)][_0x1d76d6(0x1d4)]);}catch{gp=await conn['getProfilePicture']();}const tag='@'+msg[_0x1d76d6(0x1c8)][0x0][_0x1d76d6(0x1eb)]('@')[0x0];var rashijson=await conn[_0x1d76d6(0x1ee)](msg[_0x1d76d6(0x1e9)][_0x1d76d6(0x1d4)]),time=new Date()[_0x1d76d6(0x1d9)]('HI',{'timeZone':_0x1d76d6(0x1f7)})['split']('\x20')[0x1];await axios[_0x1d76d6(0x1e1)](gp,{'responseType':_0x1d76d6(0x1f4)})[_0x1d76d6(0x1d0)](async _0x2bfae7=>{var _0x19eb39=_0x1d76d6;await conn['sendMessage'](msg[_0x19eb39(0x1e9)][_0x19eb39(0x1d4)],_0x2bfae7[_0x19eb39(0x1e0)],MessageType[_0x19eb39(0x1c5)],{'thumbnail':fs[_0x19eb39(0x1c4)]('./media/image/bye.jpg'),'caption':gb[_0x19eb39(0x1d2)]['replace']('{gp}','')[_0x19eb39(0x1f1)](_0x19eb39(0x1bb),rashijson[_0x19eb39(0x1db)])['replace']('{gpmaker}',rashijson[_0x19eb39(0x1f6)])[_0x19eb39(0x1f1)]('{gpdesc}',rashijson[_0x19eb39(0x1da)])[_0x19eb39(0x1f1)](_0x19eb39(0x1c9),conn[_0x19eb39(0x1b8)][_0x19eb39(0x1f0)])[_0x19eb39(0x1f1)]('{time}',time)['replace']('{mention}',tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});});}else{if(gb[_0x1d76d6(0x1d2)]['includes'](_0x1d76d6(0x1d6))){const tag='@'+msg[_0x1d76d6(0x1c8)][0x0][_0x1d76d6(0x1eb)]('@')[0x0];var plkpinky=await axios[_0x1d76d6(0x1e1)](config[_0x1d76d6(0x1c6)],{'responseType':'arraybuffer'}),pinkjson=await conn[_0x1d76d6(0x1ee)](msg[_0x1d76d6(0x1e9)][_0x1d76d6(0x1d4)]),time=new Date()[_0x1d76d6(0x1d9)]('HI',{'timeZone':'Asia/Kolkata'})[_0x1d76d6(0x1eb)]('\x20')[0x1];await conn[_0x1d76d6(0x1e3)](msg['key'][_0x1d76d6(0x1d4)],Buffer[_0x1d76d6(0x1d7)](plkpinky['data']),MessageType[_0x1d76d6(0x1e4)],{'thumbnail':fs[_0x1d76d6(0x1c4)](_0x1d76d6(0x1f2)),'mimetype':Mimetype[_0x1d76d6(0x1e8)],'caption':gb[_0x1d76d6(0x1d2)][_0x1d76d6(0x1f1)]('{gif}','')[_0x1d76d6(0x1f1)](_0x1d76d6(0x1bb),pinkjson['subject'])[_0x1d76d6(0x1f1)]('{gpmaker}',pinkjson['owner'])['replace']('{gpdesc}',pinkjson['desc'])['replace'](_0x1d76d6(0x1c9),conn[_0x1d76d6(0x1b8)][_0x1d76d6(0x1f0)])['replace'](_0x1d76d6(0x1c0),time)['replace'](_0x1d76d6(0x1e2),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});}else{var time=new Date()[_0x1d76d6(0x1d9)]('HI',{'timeZone':_0x1d76d6(0x1f7)})[_0x1d76d6(0x1eb)]('\x20')[0x1];const tag='@'+msg[_0x1d76d6(0x1c8)][0x0][_0x1d76d6(0x1eb)]('@')[0x0];await conn[_0x1d76d6(0x1e3)](msg[_0x1d76d6(0x1e9)]['remoteJid'],gb['message'][_0x1d76d6(0x1f1)](_0x1d76d6(0x1bb),pinkjson['subject'])['replace'](_0x1d76d6(0x1bf),pinkjson[_0x1d76d6(0x1f6)])['replace']('{gpdesc}',pinkjson[_0x1d76d6(0x1da)])[_0x1d76d6(0x1f1)]('{owner}',conn['user'][_0x1d76d6(0x1f0)])['replace'](_0x1d76d6(0x1c0),time)[_0x1d76d6(0x1f1)](_0x1d76d6(0x1e2),tag),MessageType[_0x1d76d6(0x1de)],{'contextInfo':{'mentionedJid':[msg[_0x1d76d6(0x1c8)][0x0]]}});}}}}return;}else{if(msg[_0x1d76d6(0x1ea)]===0x28||msg[_0x1d76d6(0x1ea)]===0x29){if(config['CALLB']==_0x1d76d6(0x1ec)){await conn[_0x1d76d6(0x1e3)](msg[_0x1d76d6(0x1e9)][_0x1d76d6(0x1d4)],_0x1d76d6(0x1ef),MessageType[_0x1d76d6(0x1de)]);return;}}else{if(msg['messageStubType']===0x1b||msg['messageStubType']===0x1f){const tag='@'+msg[_0x1d76d6(0x1c8)][0x0]['split']('@')[0x0];var gb=await getMessage(msg[_0x1d76d6(0x1e9)][_0x1d76d6(0x1d4)]);if(gb!==![]){if(gb['message'][_0x1d76d6(0x1df)](_0x1d76d6(0x1b4))){let pp;try{pp=await conn[_0x1d76d6(0x1cb)](msg['messageStubParameters'][0x0]);}catch{pp=await conn[_0x1d76d6(0x1cb)]();}var pinkjson=await conn[_0x1d76d6(0x1ee)](msg[_0x1d76d6(0x1e9)][_0x1d76d6(0x1d4)]),time=new Date()['toLocaleString']('HI',{'timeZone':_0x1d76d6(0x1f7)})['split']('\x20')[0x1];await axios['get'](pp,{'responseType':_0x1d76d6(0x1f4)})['then'](async _0xa0896d=>{var _0x34811f=_0x1d76d6;await conn['sendMessage'](msg[_0x34811f(0x1e9)][_0x34811f(0x1d4)],_0xa0896d[_0x34811f(0x1e0)],MessageType['image'],{'thumbnail':fs[_0x34811f(0x1c4)](_0x34811f(0x1ce)),'caption':gb[_0x34811f(0x1d2)][_0x34811f(0x1f1)](_0x34811f(0x1b4),'')[_0x34811f(0x1f1)]('{gphead}',pinkjson[_0x34811f(0x1db)])['replace']('{gpmaker}',pinkjson[_0x34811f(0x1f6)])['replace']('{gpdesc}',pinkjson[_0x34811f(0x1da)])['replace']('{owner}',conn[_0x34811f(0x1b8)][_0x34811f(0x1f0)])[_0x34811f(0x1f1)](_0x34811f(0x1c0),time)[_0x34811f(0x1f1)](_0x34811f(0x1e2),tag),'contextInfo':{'mentionedJid':[msg[_0x34811f(0x1c8)][0x0]]}});});}else{if(gb[_0x1d76d6(0x1d2)][_0x1d76d6(0x1df)](_0x1d76d6(0x1b6))){const tag='@'+msg[_0x1d76d6(0x1c8)][0x0][_0x1d76d6(0x1eb)]('@')[0x0];let gp;try{gp=await conn['getProfilePicture'](msg[_0x1d76d6(0x1e9)]['remoteJid']);}catch{gp=await conn[_0x1d76d6(0x1cb)]();}var time=new Date()['toLocaleString']('HI',{'timeZone':'Asia/Kolkata'})['split']('\x20')[0x1],rashijson=await conn[_0x1d76d6(0x1ee)](msg[_0x1d76d6(0x1e9)]['remoteJid']);await axios['get'](gp,{'responseType':_0x1d76d6(0x1f4)})[_0x1d76d6(0x1d0)](async _0x2a858a=>{var _0x151d1d=_0x1d76d6;await conn[_0x151d1d(0x1e3)](msg[_0x151d1d(0x1e9)][_0x151d1d(0x1d4)],_0x2a858a[_0x151d1d(0x1e0)],MessageType[_0x151d1d(0x1c5)],{'thumbnail':fs['readFileSync'](_0x151d1d(0x1ce)),'caption':gb[_0x151d1d(0x1d2)][_0x151d1d(0x1f1)]('{gp}','')[_0x151d1d(0x1f1)](_0x151d1d(0x1bb),rashijson[_0x151d1d(0x1db)])['replace'](_0x151d1d(0x1bf),rashijson['owner'])[_0x151d1d(0x1f1)](_0x151d1d(0x1ba),rashijson[_0x151d1d(0x1da)])[_0x151d1d(0x1f1)](_0x151d1d(0x1c9),conn['user']['name'])['replace'](_0x151d1d(0x1c0),time)[_0x151d1d(0x1f1)](_0x151d1d(0x1e2),tag),'contextInfo':{'mentionedJid':[msg[_0x151d1d(0x1c8)][0x0]]}});});}else{if(gb[_0x1d76d6(0x1d2)]['includes'](_0x1d76d6(0x1d6))){var time=new Date()['toLocaleString']('HI',{'timeZone':_0x1d76d6(0x1f7)})[_0x1d76d6(0x1eb)]('\x20')[0x1];const tag='@'+msg[_0x1d76d6(0x1c8)][0x0][_0x1d76d6(0x1eb)]('@')[0x0];var plkpinky=await axios[_0x1d76d6(0x1e1)](config[_0x1d76d6(0x1f5)],{'responseType':_0x1d76d6(0x1f4)}),pinkjson=await conn[_0x1d76d6(0x1ee)](msg[_0x1d76d6(0x1e9)][_0x1d76d6(0x1d4)]);await conn[_0x1d76d6(0x1e3)](msg[_0x1d76d6(0x1e9)][_0x1d76d6(0x1d4)],Buffer[_0x1d76d6(0x1d7)](plkpinky[_0x1d76d6(0x1e0)]),MessageType[_0x1d76d6(0x1e4)],{'thumbnail':fs['readFileSync'](_0x1d76d6(0x1ce)),'mimetype':Mimetype['gif'],'caption':gb[_0x1d76d6(0x1d2)][_0x1d76d6(0x1f1)]('{gif}','')[_0x1d76d6(0x1f1)](_0x1d76d6(0x1bb),pinkjson[_0x1d76d6(0x1db)])[_0x1d76d6(0x1f1)](_0x1d76d6(0x1bf),pinkjson[_0x1d76d6(0x1f6)])[_0x1d76d6(0x1f1)]('{gpdesc}',pinkjson[_0x1d76d6(0x1da)])['replace'](_0x1d76d6(0x1c9),conn[_0x1d76d6(0x1b8)]['name'])[_0x1d76d6(0x1f1)](_0x1d76d6(0x1c0),time)[_0x1d76d6(0x1f1)](_0x1d76d6(0x1e2),tag),'contextInfo':{'mentionedJid':[msg[_0x1d76d6(0x1c8)][0x0]]}});}else{const tag='@'+msg[_0x1d76d6(0x1c8)][0x0]['split']('@')[0x0];var time=new Date()['toLocaleString']('HI',{'timeZone':'Asia/Kolkata'})[_0x1d76d6(0x1eb)]('\x20')[0x1],pinkjson=await conn[_0x1d76d6(0x1ee)](msg['key'][_0x1d76d6(0x1d4)]);await conn['sendMessage'](msg['key'][_0x1d76d6(0x1d4)],gb[_0x1d76d6(0x1d2)][_0x1d76d6(0x1f1)](_0x1d76d6(0x1bb),pinkjson['subject'])['replace'](_0x1d76d6(0x1bf),pinkjson[_0x1d76d6(0x1f6)])[_0x1d76d6(0x1f1)](_0x1d76d6(0x1ba),pinkjson[_0x1d76d6(0x1da)])[_0x1d76d6(0x1f1)](_0x1d76d6(0x1c9),conn[_0x1d76d6(0x1b8)][_0x1d76d6(0x1f0)])[_0x1d76d6(0x1f1)](_0x1d76d6(0x1c0),time)[_0x1d76d6(0x1f1)](_0x1d76d6(0x1e2),tag),MessageType['text'],{'contextInfo':{'mentionedJid':[msg[_0x1d76d6(0x1c8)][0x0]]}});}}}}return;}}}

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
