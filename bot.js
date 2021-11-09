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

var _0x38fa0f=_0x110b;(function(_0x49d45f,_0x3d689d){var _0xe6c64c=_0x110b,_0xbcb487=_0x49d45f();while(!![]){try{var _0x19f6e4=parseInt(_0xe6c64c(0x114))/0x1+parseInt(_0xe6c64c(0x142))/0x2+parseInt(_0xe6c64c(0x10f))/0x3*(-parseInt(_0xe6c64c(0x13d))/0x4)+-parseInt(_0xe6c64c(0x135))/0x5*(-parseInt(_0xe6c64c(0x109))/0x6)+parseInt(_0xe6c64c(0x122))/0x7*(parseInt(_0xe6c64c(0x11a))/0x8)+parseInt(_0xe6c64c(0x101))/0x9*(-parseInt(_0xe6c64c(0x10e))/0xa)+-parseInt(_0xe6c64c(0x13f))/0xb*(parseInt(_0xe6c64c(0x12e))/0xc);if(_0x19f6e4===_0x3d689d)break;else _0xbcb487['push'](_0xbcb487['shift']());}catch(_0x5337de){_0xbcb487['push'](_0xbcb487['shift']());}}}(_0x88a5,0x48870));function _0x88a5(){var _0x4e0b47=['GIF_BYE','arraybuffer','toLocaleString','Ok\x20bye','238028KcyHfa','user','916498XldjvX','getProfilePicture','video','810642YSGeuZ','desc','{gif}','get','{pp}','{gpdesc}','Asia/Kolkata','3089970HHyYxW','{gpmaker}','length','apply','__proto__','toString','{gp}','image','12sWCgqR','from','{}.constructor(\x22return\x20this\x22)(\x20)','text','prototype','10WXOVRS','18oEivXq','{mention}','data','name','constructor','143423ArAdBV','error','sendMessage','replace','./media/image/bye.jpg','trace','32pnOcMX','message','console','{owner}','owner','./media/image/wel.jpg','messageStubType','{gphead}','11809fCSuaY','includes','messageStubParameters','key','blockUser','groupMetadata','remoteJid','true','bind','{time}','then','client','12VuWJot','subject','WEL_GIF','exception','gif','split','search','1313175yeDcgn','readFileSync','(((.+)+)+)+$','warn'];_0x88a5=function(){return _0x4e0b47;};return _0x88a5();}var _0x3d1ab9=(function(){var _0x26cd6c=!![];return function(_0x380eb8,_0x74906){var _0x2f12dd=_0x26cd6c?function(){var _0x53b140=_0x110b;if(_0x74906){var _0x330486=_0x74906[_0x53b140(0x104)](_0x380eb8,arguments);return _0x74906=null,_0x330486;}}:function(){};return _0x26cd6c=![],_0x2f12dd;};}()),_0x3647ed=_0x3d1ab9(this,function(){var _0x250a39=_0x110b;return _0x3647ed[_0x250a39(0x106)]()['search'](_0x250a39(0x137))[_0x250a39(0x106)]()['constructor'](_0x3647ed)[_0x250a39(0x134)]('(((.+)+)+)+$');});function _0x110b(_0x2bfb33,_0x3cf358){var _0x294abc=_0x88a5();return _0x110b=function(_0x48415f,_0x1f4a4e){_0x48415f=_0x48415f-0xfd;var _0x4f5620=_0x294abc[_0x48415f];return _0x4f5620;},_0x110b(_0x2bfb33,_0x3cf358);}_0x3647ed();var _0x1f4a4e=(function(){var _0x1d0504=!![];return function(_0x2cfb52,_0x2bc1a9){var _0x3202ad=_0x1d0504?function(){var _0x5abad9=_0x110b;if(_0x2bc1a9){var _0x144721=_0x2bc1a9[_0x5abad9(0x104)](_0x2cfb52,arguments);return _0x2bc1a9=null,_0x144721;}}:function(){};return _0x1d0504=![],_0x3202ad;};}()),_0x48415f=_0x1f4a4e(this,function(){var _0x5f18a1=_0x110b,_0x2a1e03=function(){var _0x4a5805=_0x110b,_0x5630f2;try{_0x5630f2=Function('return\x20(function()\x20'+_0x4a5805(0x10b)+');')();}catch(_0x23a626){_0x5630f2=window;}return _0x5630f2;},_0x4e4439=_0x2a1e03(),_0x5babc7=_0x4e4439['console']=_0x4e4439[_0x5f18a1(0x11c)]||{},_0x5b8f3c=['log',_0x5f18a1(0x138),'info',_0x5f18a1(0x115),_0x5f18a1(0x131),'table',_0x5f18a1(0x119)];for(var _0x49a75f=0x0;_0x49a75f<_0x5b8f3c[_0x5f18a1(0x103)];_0x49a75f++){var _0x9a5cb5=_0x1f4a4e[_0x5f18a1(0x113)][_0x5f18a1(0x10d)][_0x5f18a1(0x12a)](_0x1f4a4e),_0x31b0ee=_0x5b8f3c[_0x49a75f],_0x5d1698=_0x5babc7[_0x31b0ee]||_0x9a5cb5;_0x9a5cb5[_0x5f18a1(0x105)]=_0x1f4a4e[_0x5f18a1(0x12a)](_0x1f4a4e),_0x9a5cb5['toString']=_0x5d1698[_0x5f18a1(0x106)][_0x5f18a1(0x12a)](_0x5d1698),_0x5babc7[_0x31b0ee]=_0x9a5cb5;}});_0x48415f();if(msg[_0x38fa0f(0x120)]===0x20||msg['messageStubType']===0x1c){var gb=await getMessage(msg[_0x38fa0f(0x125)][_0x38fa0f(0x128)],'goodbye');if(gb!==![]){if(gb[_0x38fa0f(0x11b)][_0x38fa0f(0x123)](_0x38fa0f(0xfe))){let pp;try{pp=await conn['getProfilePicture'](msg[_0x38fa0f(0x124)][0x0]);}catch{pp=await conn[_0x38fa0f(0x140)]();}var pinkjson=await conn[_0x38fa0f(0x127)](msg[_0x38fa0f(0x125)]['remoteJid']);const tag='@'+msg['messageStubParameters'][0x0][_0x38fa0f(0x133)]('@')[0x0];var time=new Date()[_0x38fa0f(0x13b)]('HI',{'timeZone':_0x38fa0f(0x100)})[_0x38fa0f(0x133)]('\x20')[0x1];await axios[_0x38fa0f(0xfd)](pp,{'responseType':_0x38fa0f(0x13a)})[_0x38fa0f(0x12c)](async _0x2bc7d7=>{var _0x478e99=_0x38fa0f;await conn['sendMessage'](msg[_0x478e99(0x125)][_0x478e99(0x128)],_0x2bc7d7[_0x478e99(0x111)],MessageType[_0x478e99(0x108)],{'thumbnail':fs['readFileSync'](_0x478e99(0x118)),'caption':gb[_0x478e99(0x11b)][_0x478e99(0x117)](_0x478e99(0xfe),'')[_0x478e99(0x117)]('{gphead}',pinkjson[_0x478e99(0x12f)])[_0x478e99(0x117)](_0x478e99(0x102),pinkjson[_0x478e99(0x11e)])[_0x478e99(0x117)]('{gpdesc}',pinkjson[_0x478e99(0x143)])[_0x478e99(0x117)]('{owner}',conn[_0x478e99(0x13e)][_0x478e99(0x112)])[_0x478e99(0x117)](_0x478e99(0x12b),time)[_0x478e99(0x117)](_0x478e99(0x110),tag),'contextInfo':{'mentionedJid':[msg[_0x478e99(0x124)][0x0]]}});});}else{if(gb[_0x38fa0f(0x11b)][_0x38fa0f(0x123)](_0x38fa0f(0x107))){let gp;try{gp=await conn[_0x38fa0f(0x140)](msg[_0x38fa0f(0x125)][_0x38fa0f(0x128)]);}catch{gp=await conn['getProfilePicture']();}const tag='@'+msg[_0x38fa0f(0x124)][0x0]['split']('@')[0x0];var rashijson=await conn[_0x38fa0f(0x127)](msg[_0x38fa0f(0x125)]['remoteJid']),time=new Date()[_0x38fa0f(0x13b)]('HI',{'timeZone':'Asia/Kolkata'})[_0x38fa0f(0x133)]('\x20')[0x1];await axios[_0x38fa0f(0xfd)](gp,{'responseType':_0x38fa0f(0x13a)})[_0x38fa0f(0x12c)](async _0x5a8b5e=>{var _0x2a54af=_0x38fa0f;await conn[_0x2a54af(0x116)](msg['key']['remoteJid'],_0x5a8b5e['data'],MessageType['image'],{'thumbnail':fs[_0x2a54af(0x136)](_0x2a54af(0x118)),'caption':gb['message'][_0x2a54af(0x117)](_0x2a54af(0x107),'')[_0x2a54af(0x117)](_0x2a54af(0x121),rashijson[_0x2a54af(0x12f)])[_0x2a54af(0x117)]('{gpmaker}',rashijson[_0x2a54af(0x11e)])[_0x2a54af(0x117)](_0x2a54af(0xff),rashijson[_0x2a54af(0x143)])[_0x2a54af(0x117)](_0x2a54af(0x11d),conn[_0x2a54af(0x13e)]['name'])[_0x2a54af(0x117)](_0x2a54af(0x12b),time)['replace'](_0x2a54af(0x110),tag),'contextInfo':{'mentionedJid':[msg[_0x2a54af(0x124)][0x0]]}});});}else{if(gb['message'][_0x38fa0f(0x123)]('{gif}')){const tag='@'+msg[_0x38fa0f(0x124)][0x0][_0x38fa0f(0x133)]('@')[0x0];var plkpinky=await axios[_0x38fa0f(0xfd)](config[_0x38fa0f(0x139)],{'responseType':_0x38fa0f(0x13a)}),pinkjson=await conn[_0x38fa0f(0x127)](msg['key'][_0x38fa0f(0x128)]),time=new Date()[_0x38fa0f(0x13b)]('HI',{'timeZone':'Asia/Kolkata'})[_0x38fa0f(0x133)]('\x20')[0x1];await conn[_0x38fa0f(0x116)](msg[_0x38fa0f(0x125)][_0x38fa0f(0x128)],Buffer[_0x38fa0f(0x10a)](plkpinky[_0x38fa0f(0x111)]),MessageType[_0x38fa0f(0x141)],{'thumbnail':fs[_0x38fa0f(0x136)](_0x38fa0f(0x118)),'mimetype':Mimetype['gif'],'caption':gb['message'][_0x38fa0f(0x117)](_0x38fa0f(0x144),'')['replace'](_0x38fa0f(0x121),pinkjson[_0x38fa0f(0x12f)])[_0x38fa0f(0x117)]('{gpmaker}',pinkjson[_0x38fa0f(0x11e)])[_0x38fa0f(0x117)](_0x38fa0f(0xff),pinkjson['desc'])[_0x38fa0f(0x117)](_0x38fa0f(0x11d),conn[_0x38fa0f(0x13e)][_0x38fa0f(0x112)])['replace']('{time}',time)[_0x38fa0f(0x117)](_0x38fa0f(0x110),tag),'contextInfo':{'mentionedJid':[msg[_0x38fa0f(0x124)][0x0]]}});}else{var time=new Date()[_0x38fa0f(0x13b)]('HI',{'timeZone':_0x38fa0f(0x100)})[_0x38fa0f(0x133)]('\x20')[0x1];const tag='@'+msg['messageStubParameters'][0x0]['split']('@')[0x0];await conn[_0x38fa0f(0x116)](msg[_0x38fa0f(0x125)]['remoteJid'],gb['message']['replace'](_0x38fa0f(0x121),pinkjson[_0x38fa0f(0x12f)])['replace'](_0x38fa0f(0x102),pinkjson[_0x38fa0f(0x11e)])[_0x38fa0f(0x117)]('{gpdesc}',pinkjson[_0x38fa0f(0x143)])[_0x38fa0f(0x117)]('{owner}',conn[_0x38fa0f(0x13e)][_0x38fa0f(0x112)])[_0x38fa0f(0x117)](_0x38fa0f(0x12b),time)[_0x38fa0f(0x117)](_0x38fa0f(0x110),tag),{'contextInfo':{'mentionedJid':[msg[_0x38fa0f(0x124)][0x0]]}},MessageType[_0x38fa0f(0x10c)]);}}}}return;}else{if(msg['messageStubType']===0x28||msg[_0x38fa0f(0x120)]===0x29){if(config['CALLB']==_0x38fa0f(0x129)){await conn[_0x38fa0f(0x116)](msg['key'][_0x38fa0f(0x128)],_0x38fa0f(0x13c),MessageType['text']),await message[_0x38fa0f(0x12d)][_0x38fa0f(0x126)](msg[_0x38fa0f(0x125)][_0x38fa0f(0x128)],'add');return;}}else{if(msg[_0x38fa0f(0x120)]===0x1b||msg[_0x38fa0f(0x120)]===0x1f){const tag='@'+msg[_0x38fa0f(0x124)][0x0]['split']('@')[0x0];var gb=await getMessage(msg[_0x38fa0f(0x125)][_0x38fa0f(0x128)]);if(gb!==![]){if(gb['message'][_0x38fa0f(0x123)](_0x38fa0f(0xfe))){let pp;try{pp=await conn[_0x38fa0f(0x140)](msg[_0x38fa0f(0x124)][0x0]);}catch{pp=await conn[_0x38fa0f(0x140)]();}var pinkjson=await conn[_0x38fa0f(0x127)](msg[_0x38fa0f(0x125)][_0x38fa0f(0x128)]),time=new Date()['toLocaleString']('HI',{'timeZone':_0x38fa0f(0x100)})[_0x38fa0f(0x133)]('\x20')[0x1];await axios[_0x38fa0f(0xfd)](pp,{'responseType':_0x38fa0f(0x13a)})['then'](async _0xf75021=>{var _0x295081=_0x38fa0f;await conn[_0x295081(0x116)](msg[_0x295081(0x125)]['remoteJid'],_0xf75021[_0x295081(0x111)],MessageType[_0x295081(0x108)],{'thumbnail':fs[_0x295081(0x136)](_0x295081(0x11f)),'caption':gb['message'][_0x295081(0x117)](_0x295081(0xfe),'')[_0x295081(0x117)](_0x295081(0x121),pinkjson[_0x295081(0x12f)])[_0x295081(0x117)](_0x295081(0x102),pinkjson[_0x295081(0x11e)])[_0x295081(0x117)](_0x295081(0xff),pinkjson[_0x295081(0x143)])[_0x295081(0x117)]('{owner}',conn[_0x295081(0x13e)]['name'])[_0x295081(0x117)](_0x295081(0x12b),time)[_0x295081(0x117)](_0x295081(0x110),tag),'contextInfo':{'mentionedJid':[msg[_0x295081(0x124)][0x0]]}});});}else{if(gb[_0x38fa0f(0x11b)][_0x38fa0f(0x123)](_0x38fa0f(0x107))){const tag='@'+msg[_0x38fa0f(0x124)][0x0]['split']('@')[0x0];let gp;try{gp=await conn['getProfilePicture'](msg['key'][_0x38fa0f(0x128)]);}catch{gp=await conn['getProfilePicture']();}var time=new Date()[_0x38fa0f(0x13b)]('HI',{'timeZone':_0x38fa0f(0x100)})[_0x38fa0f(0x133)]('\x20')[0x1],rashijson=await conn['groupMetadata'](msg[_0x38fa0f(0x125)][_0x38fa0f(0x128)]);await axios['get'](gp,{'responseType':_0x38fa0f(0x13a)})[_0x38fa0f(0x12c)](async _0x22dff3=>{var _0x1ce36c=_0x38fa0f;await conn['sendMessage'](msg[_0x1ce36c(0x125)][_0x1ce36c(0x128)],_0x22dff3['data'],MessageType[_0x1ce36c(0x108)],{'thumbnail':fs[_0x1ce36c(0x136)](_0x1ce36c(0x11f)),'caption':gb[_0x1ce36c(0x11b)][_0x1ce36c(0x117)]('{gp}','')['replace']('{gphead}',rashijson['subject'])[_0x1ce36c(0x117)](_0x1ce36c(0x102),rashijson[_0x1ce36c(0x11e)])['replace'](_0x1ce36c(0xff),rashijson[_0x1ce36c(0x143)])[_0x1ce36c(0x117)](_0x1ce36c(0x11d),conn[_0x1ce36c(0x13e)][_0x1ce36c(0x112)])['replace']('{time}',time)[_0x1ce36c(0x117)](_0x1ce36c(0x110),tag),'contextInfo':{'mentionedJid':[msg[_0x1ce36c(0x124)][0x0]]}});});}else{if(gb[_0x38fa0f(0x11b)][_0x38fa0f(0x123)](_0x38fa0f(0x144))){var time=new Date()[_0x38fa0f(0x13b)]('HI',{'timeZone':_0x38fa0f(0x100)})['split']('\x20')[0x1];const tag='@'+msg['messageStubParameters'][0x0][_0x38fa0f(0x133)]('@')[0x0];var plkpinky=await axios[_0x38fa0f(0xfd)](config[_0x38fa0f(0x130)],{'responseType':_0x38fa0f(0x13a)}),pinkjson=await conn[_0x38fa0f(0x127)](msg['key']['remoteJid']);await conn['sendMessage'](msg['key'][_0x38fa0f(0x128)],Buffer[_0x38fa0f(0x10a)](plkpinky[_0x38fa0f(0x111)]),MessageType[_0x38fa0f(0x141)],{'thumbnail':fs[_0x38fa0f(0x136)]('./media/image/wel.jpg'),'mimetype':Mimetype[_0x38fa0f(0x132)],'caption':gb[_0x38fa0f(0x11b)][_0x38fa0f(0x117)]('{gif}','')[_0x38fa0f(0x117)](_0x38fa0f(0x121),pinkjson['subject'])[_0x38fa0f(0x117)](_0x38fa0f(0x102),pinkjson['owner'])['replace']('{gpdesc}',pinkjson[_0x38fa0f(0x143)])['replace'](_0x38fa0f(0x11d),conn[_0x38fa0f(0x13e)][_0x38fa0f(0x112)])[_0x38fa0f(0x117)]('{time}',time)[_0x38fa0f(0x117)](_0x38fa0f(0x110),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});}else{const tag='@'+msg[_0x38fa0f(0x124)][0x0][_0x38fa0f(0x133)]('@')[0x0];var time=new Date()[_0x38fa0f(0x13b)]('HI',{'timeZone':_0x38fa0f(0x100)})[_0x38fa0f(0x133)]('\x20')[0x1],pinkjson=await conn[_0x38fa0f(0x127)](msg[_0x38fa0f(0x125)][_0x38fa0f(0x128)]);await conn[_0x38fa0f(0x116)](msg['key']['remoteJid'],gb['message']['replace']('{gphead}',pinkjson[_0x38fa0f(0x12f)])[_0x38fa0f(0x117)](_0x38fa0f(0x102),pinkjson[_0x38fa0f(0x11e)])[_0x38fa0f(0x117)](_0x38fa0f(0xff),pinkjson[_0x38fa0f(0x143)])[_0x38fa0f(0x117)]('{owner}',conn[_0x38fa0f(0x13e)][_0x38fa0f(0x112)])[_0x38fa0f(0x117)]('{time}',time)['replace'](_0x38fa0f(0x110),tag),{'contextInfo':{'mentionedJid':[msg[_0x38fa0f(0x124)][0x0]]}},MessageType[_0x38fa0f(0x10c)]);}}}}return;}}}

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
