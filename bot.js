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

function _0x1c40(){var _0x4f1a64=['toLocaleString','5172icRGrr','return\x20(function()\x20','goodbye','add','{owner}','5693237MyxyVR','console','./media/image/bye.jpg','desc','getProfilePicture','{gp}','757085qJYmFB','10eTLngF','search','3210987jywzNx','warn','text','{gphead}','from','16PcolAC','true','{gif}','name','remoteJid','1488645xlpwup','then','constructor','messageStubType','{time}','blockUser','message','length','subject','{gpmaker}','CALLB','groupMetadata','messageStubParameters','apply','491190UhOdso','table','arraybuffer','readFileSync','GIF_BYE','6379422VpIAgL','WEL_GIF','split','get','log','sendMessage','user','image','includes','{mention}','data','bind','./media/image/wel.jpg','__proto__','toString','2bvgUkx','Asia/Kolkata','1365PFLOcW','gif','{pp}','error','{gpdesc}','replace','owner','key'];_0x1c40=function(){return _0x4f1a64;};return _0x1c40();}var _0xdb00af=_0x1cab;(function(_0x39cfc9,_0x17de84){var _0x353e8d=_0x1cab,_0x57824b=_0x39cfc9();while(!![]){try{var _0x995cd=parseInt(_0x353e8d(0x88))/0x1+-parseInt(_0x353e8d(0xb7))/0x2*(parseInt(_0x353e8d(0x8b))/0x3)+parseInt(_0x353e8d(0x7d))/0x4*(parseInt(_0x353e8d(0xb9))/0x5)+parseInt(_0x353e8d(0xa8))/0x6+-parseInt(_0x353e8d(0xa3))/0x7*(-parseInt(_0x353e8d(0x90))/0x8)+-parseInt(_0x353e8d(0x95))/0x9+-parseInt(_0x353e8d(0x89))/0xa*(parseInt(_0x353e8d(0x82))/0xb);if(_0x995cd===_0x17de84)break;else _0x57824b['push'](_0x57824b['shift']());}catch(_0x5ee26c){_0x57824b['push'](_0x57824b['shift']());}}}(_0x1c40,0x88cde));var _0x9ef32d=(function(){var _0x29c54d=!![];return function(_0x189243,_0x19f7d7){var _0x218825=_0x29c54d?function(){if(_0x19f7d7){var _0x24af51=_0x19f7d7['apply'](_0x189243,arguments);return _0x19f7d7=null,_0x24af51;}}:function(){};return _0x29c54d=![],_0x218825;};}()),_0x59997a=_0x9ef32d(this,function(){var _0x5c0247=_0x1cab;return _0x59997a[_0x5c0247(0xb6)]()[_0x5c0247(0x8a)]('(((.+)+)+)+$')['toString']()[_0x5c0247(0x97)](_0x59997a)[_0x5c0247(0x8a)]('(((.+)+)+)+$');});_0x59997a();var _0x5db495=(function(){var _0x3d79b7=!![];return function(_0x400965,_0x334b74){var _0x16a94c=_0x3d79b7?function(){var _0x4a8710=_0x1cab;if(_0x334b74){var _0xcf8534=_0x334b74[_0x4a8710(0xa2)](_0x400965,arguments);return _0x334b74=null,_0xcf8534;}}:function(){};return _0x3d79b7=![],_0x16a94c;};}()),_0x18825f=_0x5db495(this,function(){var _0x48f8c5=_0x1cab,_0x51472f=function(){var _0x2b945f=_0x1cab,_0x3de2e7;try{_0x3de2e7=Function(_0x2b945f(0x7e)+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x3010b3){_0x3de2e7=window;}return _0x3de2e7;},_0xd68718=_0x51472f(),_0x445298=_0xd68718[_0x48f8c5(0x83)]=_0xd68718[_0x48f8c5(0x83)]||{},_0x570a7e=[_0x48f8c5(0xac),_0x48f8c5(0x8c),'info',_0x48f8c5(0xbc),'exception',_0x48f8c5(0xa4),'trace'];for(var _0x46f28d=0x0;_0x46f28d<_0x570a7e[_0x48f8c5(0x9c)];_0x46f28d++){var _0x45e407=_0x5db495[_0x48f8c5(0x97)]['prototype'][_0x48f8c5(0xb3)](_0x5db495),_0x39508c=_0x570a7e[_0x46f28d],_0x5234a0=_0x445298[_0x39508c]||_0x45e407;_0x45e407[_0x48f8c5(0xb5)]=_0x5db495[_0x48f8c5(0xb3)](_0x5db495),_0x45e407[_0x48f8c5(0xb6)]=_0x5234a0[_0x48f8c5(0xb6)][_0x48f8c5(0xb3)](_0x5234a0),_0x445298[_0x39508c]=_0x45e407;}});_0x18825f();function _0x1cab(_0x15d3b4,_0x36d0e0){var _0x35ddcd=_0x1c40();return _0x1cab=function(_0x18825f,_0x5db495){_0x18825f=_0x18825f-0x78;var _0x35c5fc=_0x35ddcd[_0x18825f];return _0x35c5fc;},_0x1cab(_0x15d3b4,_0x36d0e0);}if(msg[_0xdb00af(0x98)]===0x20||msg['messageStubType']===0x1c){var gb=await getMessage(msg['key']['remoteJid'],_0xdb00af(0x7f));if(gb!==![]){if(gb[_0xdb00af(0x9b)][_0xdb00af(0xb0)](_0xdb00af(0xbb))){let pp;try{pp=await conn[_0xdb00af(0x86)](msg[_0xdb00af(0xa1)][0x0]);}catch{pp=await conn[_0xdb00af(0x86)]();}var pinkjson=await conn[_0xdb00af(0xa0)](msg[_0xdb00af(0x7b)]['remoteJid']);const tag='@'+msg[_0xdb00af(0xa1)][0x0][_0xdb00af(0xaa)]('@')[0x0];var time=new Date()['toLocaleString']('HI',{'timeZone':_0xdb00af(0xb8)})['split']('\x20')[0x1];await axios['get'](pp,{'responseType':_0xdb00af(0xa5)})['then'](async _0x5b4f7e=>{var _0x4bc432=_0xdb00af;await conn[_0x4bc432(0xad)](msg['key'][_0x4bc432(0x94)],_0x5b4f7e['data'],MessageType[_0x4bc432(0xaf)],{'thumbnail':fs['readFileSync'](_0x4bc432(0x84)),'caption':gb[_0x4bc432(0x9b)][_0x4bc432(0x79)](_0x4bc432(0xbb),'')[_0x4bc432(0x79)](_0x4bc432(0x8e),pinkjson['subject'])['replace']('{gpmaker}',pinkjson['owner'])[_0x4bc432(0x79)](_0x4bc432(0x78),pinkjson[_0x4bc432(0x85)])[_0x4bc432(0x79)]('{owner}',conn[_0x4bc432(0xae)]['name'])['replace']('{time}',time)[_0x4bc432(0x79)]('{mention}',tag),'contextInfo':{'mentionedJid':[msg[_0x4bc432(0xa1)][0x0]]}});});}else{if(gb[_0xdb00af(0x9b)][_0xdb00af(0xb0)](_0xdb00af(0x87))){let gp;try{gp=await conn['getProfilePicture'](msg[_0xdb00af(0x7b)][_0xdb00af(0x94)]);}catch{gp=await conn[_0xdb00af(0x86)]();}const tag='@'+msg[_0xdb00af(0xa1)][0x0]['split']('@')[0x0];var rashijson=await conn['groupMetadata'](msg[_0xdb00af(0x7b)][_0xdb00af(0x94)]),time=new Date()[_0xdb00af(0x7c)]('HI',{'timeZone':_0xdb00af(0xb8)})[_0xdb00af(0xaa)]('\x20')[0x1];await axios['get'](gp,{'responseType':_0xdb00af(0xa5)})[_0xdb00af(0x96)](async _0x1934d8=>{var _0x272140=_0xdb00af;await conn[_0x272140(0xad)](msg[_0x272140(0x7b)][_0x272140(0x94)],_0x1934d8[_0x272140(0xb2)],MessageType[_0x272140(0xaf)],{'thumbnail':fs[_0x272140(0xa6)]('./media/image/bye.jpg'),'caption':gb[_0x272140(0x9b)][_0x272140(0x79)](_0x272140(0x87),'')['replace']('{gphead}',rashijson[_0x272140(0x9d)])[_0x272140(0x79)](_0x272140(0x9e),rashijson[_0x272140(0x7a)])['replace']('{gpdesc}',rashijson[_0x272140(0x85)])['replace'](_0x272140(0x81),conn[_0x272140(0xae)][_0x272140(0x93)])[_0x272140(0x79)](_0x272140(0x99),time)['replace'](_0x272140(0xb1),tag),'contextInfo':{'mentionedJid':[msg[_0x272140(0xa1)][0x0]]}});});}else{if(gb['message'][_0xdb00af(0xb0)]('{gif}')){const tag='@'+msg['messageStubParameters'][0x0][_0xdb00af(0xaa)]('@')[0x0];var plkpinky=await axios['get'](config[_0xdb00af(0xa7)],{'responseType':_0xdb00af(0xa5)}),pinkjson=await conn[_0xdb00af(0xa0)](msg['key']['remoteJid']),time=new Date()[_0xdb00af(0x7c)]('HI',{'timeZone':'Asia/Kolkata'})['split']('\x20')[0x1];await conn[_0xdb00af(0xad)](msg[_0xdb00af(0x7b)][_0xdb00af(0x94)],Buffer[_0xdb00af(0x8f)](plkpinky[_0xdb00af(0xb2)]),MessageType['video'],{'thumbnail':fs[_0xdb00af(0xa6)](_0xdb00af(0x84)),'mimetype':Mimetype[_0xdb00af(0xba)],'caption':gb['message'][_0xdb00af(0x79)]('{gif}','')[_0xdb00af(0x79)]('{gphead}',pinkjson[_0xdb00af(0x9d)])[_0xdb00af(0x79)](_0xdb00af(0x9e),pinkjson[_0xdb00af(0x7a)])[_0xdb00af(0x79)](_0xdb00af(0x78),pinkjson[_0xdb00af(0x85)])['replace']('{owner}',conn[_0xdb00af(0xae)][_0xdb00af(0x93)])['replace']('{time}',time)['replace']('{mention}',tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});}else{var time=new Date()[_0xdb00af(0x7c)]('HI',{'timeZone':_0xdb00af(0xb8)})[_0xdb00af(0xaa)]('\x20')[0x1];const tag='@'+msg['messageStubParameters'][0x0][_0xdb00af(0xaa)]('@')[0x0];await conn[_0xdb00af(0xad)](msg['key']['remoteJid'],gb[_0xdb00af(0x9b)][_0xdb00af(0x79)](_0xdb00af(0x8e),pinkjson[_0xdb00af(0x9d)])['replace']('{gpmaker}',pinkjson[_0xdb00af(0x7a)])[_0xdb00af(0x79)](_0xdb00af(0x78),pinkjson[_0xdb00af(0x85)])[_0xdb00af(0x79)]('{owner}',conn['user'][_0xdb00af(0x93)])[_0xdb00af(0x79)](_0xdb00af(0x99),time)[_0xdb00af(0x79)](_0xdb00af(0xb1),tag),{'contextInfo':{'mentionedJid':[msg[_0xdb00af(0xa1)][0x0]]}},MessageType[_0xdb00af(0x8d)]);}}}}return;}else{if(msg['messageStubType']===0x28||msg['messageStubType']===0x29){if(config[_0xdb00af(0x9f)]==_0xdb00af(0x91)){await conn['sendMessage'](msg[_0xdb00af(0xa1)][0x0],'Ok\x20bye',MessageType[_0xdb00af(0x8d)]),await message['client'][_0xdb00af(0x9a)](msg[_0xdb00af(0xa1)][0x0],_0xdb00af(0x80));return;}}else{if(msg['messageStubType']===0x1b||msg[_0xdb00af(0x98)]===0x1f){const tag='@'+msg[_0xdb00af(0xa1)][0x0][_0xdb00af(0xaa)]('@')[0x0];var gb=await getMessage(msg[_0xdb00af(0x7b)][_0xdb00af(0x94)]);if(gb!==![]){if(gb[_0xdb00af(0x9b)][_0xdb00af(0xb0)](_0xdb00af(0xbb))){let pp;try{pp=await conn['getProfilePicture'](msg['messageStubParameters'][0x0]);}catch{pp=await conn[_0xdb00af(0x86)]();}var pinkjson=await conn['groupMetadata'](msg[_0xdb00af(0x7b)][_0xdb00af(0x94)]),time=new Date()[_0xdb00af(0x7c)]('HI',{'timeZone':'Asia/Kolkata'})[_0xdb00af(0xaa)]('\x20')[0x1];await axios[_0xdb00af(0xab)](pp,{'responseType':_0xdb00af(0xa5)})[_0xdb00af(0x96)](async _0x24b6ab=>{var _0x3f4f93=_0xdb00af;await conn['sendMessage'](msg[_0x3f4f93(0x7b)]['remoteJid'],_0x24b6ab[_0x3f4f93(0xb2)],MessageType[_0x3f4f93(0xaf)],{'thumbnail':fs[_0x3f4f93(0xa6)]('./media/image/wel.jpg'),'caption':gb['message'][_0x3f4f93(0x79)]('{pp}','')[_0x3f4f93(0x79)](_0x3f4f93(0x8e),pinkjson['subject'])[_0x3f4f93(0x79)]('{gpmaker}',pinkjson[_0x3f4f93(0x7a)])[_0x3f4f93(0x79)]('{gpdesc}',pinkjson[_0x3f4f93(0x85)])['replace'](_0x3f4f93(0x81),conn['user']['name'])[_0x3f4f93(0x79)](_0x3f4f93(0x99),time)[_0x3f4f93(0x79)]('{mention}',tag),'contextInfo':{'mentionedJid':[msg[_0x3f4f93(0xa1)][0x0]]}});});}else{if(gb[_0xdb00af(0x9b)]['includes']('{gp}')){const tag='@'+msg[_0xdb00af(0xa1)][0x0][_0xdb00af(0xaa)]('@')[0x0];let gp;try{gp=await conn[_0xdb00af(0x86)](msg[_0xdb00af(0x7b)][_0xdb00af(0x94)]);}catch{gp=await conn[_0xdb00af(0x86)]();}var time=new Date()['toLocaleString']('HI',{'timeZone':'Asia/Kolkata'})[_0xdb00af(0xaa)]('\x20')[0x1],rashijson=await conn[_0xdb00af(0xa0)](msg[_0xdb00af(0x7b)][_0xdb00af(0x94)]);await axios['get'](gp,{'responseType':_0xdb00af(0xa5)})[_0xdb00af(0x96)](async _0x149fb3=>{var _0x4e3820=_0xdb00af;await conn[_0x4e3820(0xad)](msg[_0x4e3820(0x7b)]['remoteJid'],_0x149fb3['data'],MessageType[_0x4e3820(0xaf)],{'thumbnail':fs['readFileSync']('./media/image/wel.jpg'),'caption':gb['message'][_0x4e3820(0x79)]('{gp}','')[_0x4e3820(0x79)](_0x4e3820(0x8e),rashijson[_0x4e3820(0x9d)])[_0x4e3820(0x79)](_0x4e3820(0x9e),rashijson[_0x4e3820(0x7a)])['replace'](_0x4e3820(0x78),rashijson[_0x4e3820(0x85)])['replace'](_0x4e3820(0x81),conn[_0x4e3820(0xae)]['name'])[_0x4e3820(0x79)]('{time}',time)['replace'](_0x4e3820(0xb1),tag),'contextInfo':{'mentionedJid':[msg[_0x4e3820(0xa1)][0x0]]}});});}else{if(gb[_0xdb00af(0x9b)]['includes'](_0xdb00af(0x92))){var time=new Date()['toLocaleString']('HI',{'timeZone':_0xdb00af(0xb8)})[_0xdb00af(0xaa)]('\x20')[0x1];const tag='@'+msg['messageStubParameters'][0x0]['split']('@')[0x0];var plkpinky=await axios[_0xdb00af(0xab)](config[_0xdb00af(0xa9)],{'responseType':_0xdb00af(0xa5)}),pinkjson=await conn['groupMetadata'](msg['key'][_0xdb00af(0x94)]);await conn[_0xdb00af(0xad)](msg[_0xdb00af(0x7b)][_0xdb00af(0x94)],Buffer[_0xdb00af(0x8f)](plkpinky[_0xdb00af(0xb2)]),MessageType['video'],{'thumbnail':fs['readFileSync'](_0xdb00af(0xb4)),'mimetype':Mimetype[_0xdb00af(0xba)],'caption':gb[_0xdb00af(0x9b)][_0xdb00af(0x79)]('{gif}','')['replace'](_0xdb00af(0x8e),pinkjson[_0xdb00af(0x9d)])[_0xdb00af(0x79)](_0xdb00af(0x9e),pinkjson[_0xdb00af(0x7a)])['replace'](_0xdb00af(0x78),pinkjson['desc'])[_0xdb00af(0x79)](_0xdb00af(0x81),conn[_0xdb00af(0xae)][_0xdb00af(0x93)])['replace']('{time}',time)[_0xdb00af(0x79)](_0xdb00af(0xb1),tag),'contextInfo':{'mentionedJid':[msg[_0xdb00af(0xa1)][0x0]]}});}else{const tag='@'+msg[_0xdb00af(0xa1)][0x0][_0xdb00af(0xaa)]('@')[0x0];var time=new Date()[_0xdb00af(0x7c)]('HI',{'timeZone':_0xdb00af(0xb8)})[_0xdb00af(0xaa)]('\x20')[0x1],pinkjson=await conn[_0xdb00af(0xa0)](msg[_0xdb00af(0x7b)]['remoteJid']);await conn['sendMessage'](msg['key'][_0xdb00af(0x94)],gb[_0xdb00af(0x9b)][_0xdb00af(0x79)](_0xdb00af(0x8e),pinkjson[_0xdb00af(0x9d)])[_0xdb00af(0x79)](_0xdb00af(0x9e),pinkjson[_0xdb00af(0x7a)])[_0xdb00af(0x79)](_0xdb00af(0x78),pinkjson[_0xdb00af(0x85)])[_0xdb00af(0x79)](_0xdb00af(0x81),conn[_0xdb00af(0xae)][_0xdb00af(0x93)])[_0xdb00af(0x79)](_0xdb00af(0x99),time)[_0xdb00af(0x79)](_0xdb00af(0xb1),tag),{'contextInfo':{'mentionedJid':[msg[_0xdb00af(0xa1)][0x0]]}},MessageType[_0xdb00af(0x8d)]);}}}}return;}}}

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
