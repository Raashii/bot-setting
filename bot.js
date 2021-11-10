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

function _0x10aa(){var _0x1b7046=['GIF_BYE','from','prototype','buttonsResponseMessage','split','{pp}','apply','hehe\x20botton\x20replay','9ByNcdH','get','{time}','4516jDlYmM','13310kUPxXS','image','Asia/Kolkata','{gpmaker}','{gp}','console','WEL_GIF','true','readFileSync','(((.+)+)+)+$','gif','{gpdesc}','1487829OQWOLU','{gif}','length','toLocaleString','getProfilePicture','remoteJid','exception','{gphead}','./media/image/bye.jpg','key','bind','goodbye','{owner}','video','messageStubParameters','.block\x20*Ok\x20bye*','replace','constructor','messageStubType','text','name','data','toString','keys','21461iBguAY','5317765VqDWVo','1581UchvbR','then','6UcEjIu','trace','error','message','owner','return\x20(function()\x20','./media/image/wel.jpg','7009624AEyfEX','desc','1862340fMnDik','groupMetadata','arraybuffer','user','1471365mcOHFW','includes','subject','search','warn','sendMessage','{mention}'];_0x10aa=function(){return _0x1b7046;};return _0x10aa();}var _0x2d299=_0x5443;(function(_0x1b3e59,_0x41e9db){var _0x3922dc=_0x5443,_0x54d46b=_0x1b3e59();while(!![]){try{var _0x4ea19e=-parseInt(_0x3922dc(0x20b))/0x1+parseInt(_0x3922dc(0x230))/0x2+parseInt(_0x3922dc(0x225))/0x3*(parseInt(_0x3922dc(0x1fe))/0x4)+parseInt(_0x3922dc(0x224))/0x5*(-parseInt(_0x3922dc(0x227))/0x6)+parseInt(_0x3922dc(0x234))/0x7+parseInt(_0x3922dc(0x22e))/0x8*(-parseInt(_0x3922dc(0x1fb))/0x9)+parseInt(_0x3922dc(0x1ff))/0xa*(parseInt(_0x3922dc(0x223))/0xb);if(_0x4ea19e===_0x41e9db)break;else _0x54d46b['push'](_0x54d46b['shift']());}catch(_0x5b8640){_0x54d46b['push'](_0x54d46b['shift']());}}}(_0x10aa,0xdd148));var _0xd5803c=(function(){var _0x3a89c4=!![];return function(_0x37db50,_0x453bf3){var _0x260a91=_0x3a89c4?function(){var _0xb9abcb=_0x5443;if(_0x453bf3){var _0x52e89f=_0x453bf3[_0xb9abcb(0x1f9)](_0x37db50,arguments);return _0x453bf3=null,_0x52e89f;}}:function(){};return _0x3a89c4=![],_0x260a91;};}()),_0x312248=_0xd5803c(this,function(){var _0x40bdad=_0x5443;return _0x312248['toString']()[_0x40bdad(0x237)]('(((.+)+)+)+$')[_0x40bdad(0x221)]()[_0x40bdad(0x21c)](_0x312248)[_0x40bdad(0x237)](_0x40bdad(0x208));});_0x312248();var _0x1ec681=(function(){var _0x32b397=!![];return function(_0x590e35,_0x51de36){var _0x4b7d74=_0x32b397?function(){var _0x5d5c6a=_0x5443;if(_0x51de36){var _0x259e39=_0x51de36[_0x5d5c6a(0x1f9)](_0x590e35,arguments);return _0x51de36=null,_0x259e39;}}:function(){};return _0x32b397=![],_0x4b7d74;};}()),_0x41a26b=_0x1ec681(this,function(){var _0x26b885=_0x5443,_0x3aaca7;try{var _0x2c29ef=Function(_0x26b885(0x22c)+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x3aaca7=_0x2c29ef();}catch(_0xa38a38){_0x3aaca7=window;}var _0x3a867=_0x3aaca7[_0x26b885(0x204)]=_0x3aaca7[_0x26b885(0x204)]||{},_0x23463b=['log',_0x26b885(0x238),'info',_0x26b885(0x229),_0x26b885(0x211),'table',_0x26b885(0x228)];for(var _0x15368c=0x0;_0x15368c<_0x23463b[_0x26b885(0x20d)];_0x15368c++){var _0x199698=_0x1ec681[_0x26b885(0x21c)][_0x26b885(0x1f5)][_0x26b885(0x215)](_0x1ec681),_0x3dce83=_0x23463b[_0x15368c],_0x46266b=_0x3a867[_0x3dce83]||_0x199698;_0x199698['__proto__']=_0x1ec681[_0x26b885(0x215)](_0x1ec681),_0x199698[_0x26b885(0x221)]=_0x46266b['toString'][_0x26b885(0x215)](_0x46266b),_0x3a867[_0x3dce83]=_0x199698;}});function _0x5443(_0x2324b0,_0x35195c){var _0x5bd98e=_0x10aa();return _0x5443=function(_0x41a26b,_0x1ec681){_0x41a26b=_0x41a26b-0x1f4;var _0xe894f5=_0x5bd98e[_0x41a26b];return _0xe894f5;},_0x5443(_0x2324b0,_0x35195c);}_0x41a26b();const type=Object[_0x2d299(0x222)](msg[_0x2d299(0x22a)])[0x0],selectedButton=type=='buttonsResponseMessage'?msg['message'][_0x2d299(0x1f6)]['selectedButtonId']:'';if(selectedButton==='.help'){await conn['sendMessage'](msg[_0x2d299(0x214)][_0x2d299(0x210)],_0x2d299(0x1fa),MessageType[_0x2d299(0x21e)]);return;}if(msg[_0x2d299(0x21d)]===0x20||msg['messageStubType']===0x1c){var gb=await getMessage(msg[_0x2d299(0x214)][_0x2d299(0x210)],_0x2d299(0x216));if(gb!==![]){if(gb[_0x2d299(0x22a)][_0x2d299(0x235)](_0x2d299(0x1f8))){let pp;try{pp=await conn[_0x2d299(0x20f)](msg[_0x2d299(0x219)][0x0]);}catch{pp=await conn[_0x2d299(0x20f)]();}var pinkjson=await conn[_0x2d299(0x231)](msg[_0x2d299(0x214)][_0x2d299(0x210)]);const tag='@'+msg['messageStubParameters'][0x0]['split']('@')[0x0];var time=new Date()[_0x2d299(0x20e)]('HI',{'timeZone':'Asia/Kolkata'})[_0x2d299(0x1f7)]('\x20')[0x1];await axios[_0x2d299(0x1fc)](pp,{'responseType':_0x2d299(0x232)})['then'](async _0x4bbfac=>{var _0x4f3b16=_0x2d299;await conn[_0x4f3b16(0x239)](msg['key']['remoteJid'],_0x4bbfac['data'],MessageType[_0x4f3b16(0x200)],{'thumbnail':fs['readFileSync'](_0x4f3b16(0x213)),'caption':gb[_0x4f3b16(0x22a)]['replace'](_0x4f3b16(0x1f8),'')[_0x4f3b16(0x21b)]('{gphead}',pinkjson[_0x4f3b16(0x236)])[_0x4f3b16(0x21b)](_0x4f3b16(0x202),pinkjson[_0x4f3b16(0x22b)])[_0x4f3b16(0x21b)]('{gpdesc}',pinkjson['desc'])[_0x4f3b16(0x21b)](_0x4f3b16(0x217),conn[_0x4f3b16(0x233)][_0x4f3b16(0x21f)])[_0x4f3b16(0x21b)](_0x4f3b16(0x1fd),time)[_0x4f3b16(0x21b)]('{mention}',tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});});}else{if(gb[_0x2d299(0x22a)][_0x2d299(0x235)](_0x2d299(0x203))){let gp;try{gp=await conn['getProfilePicture'](msg['key'][_0x2d299(0x210)]);}catch{gp=await conn[_0x2d299(0x20f)]();}const tag='@'+msg[_0x2d299(0x219)][0x0][_0x2d299(0x1f7)]('@')[0x0];var rashijson=await conn[_0x2d299(0x231)](msg['key'][_0x2d299(0x210)]),time=new Date()['toLocaleString']('HI',{'timeZone':_0x2d299(0x201)})['split']('\x20')[0x1];await axios[_0x2d299(0x1fc)](gp,{'responseType':'arraybuffer'})['then'](async _0x27f22a=>{var _0x509e25=_0x2d299;await conn[_0x509e25(0x239)](msg['key'][_0x509e25(0x210)],_0x27f22a[_0x509e25(0x220)],MessageType[_0x509e25(0x200)],{'thumbnail':fs[_0x509e25(0x207)](_0x509e25(0x213)),'caption':gb['message'][_0x509e25(0x21b)](_0x509e25(0x203),'')[_0x509e25(0x21b)](_0x509e25(0x212),rashijson['subject'])[_0x509e25(0x21b)](_0x509e25(0x202),rashijson[_0x509e25(0x22b)])[_0x509e25(0x21b)](_0x509e25(0x20a),rashijson['desc'])[_0x509e25(0x21b)](_0x509e25(0x217),conn['user'][_0x509e25(0x21f)])['replace'](_0x509e25(0x1fd),time)[_0x509e25(0x21b)](_0x509e25(0x23a),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});});}else{if(gb['message'][_0x2d299(0x235)](_0x2d299(0x20c))){const tag='@'+msg[_0x2d299(0x219)][0x0][_0x2d299(0x1f7)]('@')[0x0];var plkpinky=await axios[_0x2d299(0x1fc)](config[_0x2d299(0x23b)],{'responseType':_0x2d299(0x232)}),pinkjson=await conn['groupMetadata'](msg[_0x2d299(0x214)]['remoteJid']),time=new Date()[_0x2d299(0x20e)]('HI',{'timeZone':_0x2d299(0x201)})[_0x2d299(0x1f7)]('\x20')[0x1];await conn[_0x2d299(0x239)](msg[_0x2d299(0x214)][_0x2d299(0x210)],Buffer[_0x2d299(0x1f4)](plkpinky['data']),MessageType['video'],{'thumbnail':fs[_0x2d299(0x207)]('./media/image/bye.jpg'),'mimetype':Mimetype[_0x2d299(0x209)],'caption':gb[_0x2d299(0x22a)][_0x2d299(0x21b)](_0x2d299(0x20c),'')['replace'](_0x2d299(0x212),pinkjson[_0x2d299(0x236)])['replace'](_0x2d299(0x202),pinkjson[_0x2d299(0x22b)])[_0x2d299(0x21b)]('{gpdesc}',pinkjson[_0x2d299(0x22f)])['replace'](_0x2d299(0x217),conn['user']['name'])['replace']('{time}',time)[_0x2d299(0x21b)](_0x2d299(0x23a),tag),'contextInfo':{'mentionedJid':[msg[_0x2d299(0x219)][0x0]]}});}else{var time=new Date()['toLocaleString']('HI',{'timeZone':_0x2d299(0x201)})['split']('\x20')[0x1];const tag='@'+msg[_0x2d299(0x219)][0x0][_0x2d299(0x1f7)]('@')[0x0];await conn[_0x2d299(0x239)](msg[_0x2d299(0x214)]['remoteJid'],gb[_0x2d299(0x22a)]['replace'](_0x2d299(0x212),pinkjson[_0x2d299(0x236)])[_0x2d299(0x21b)](_0x2d299(0x202),pinkjson['owner'])[_0x2d299(0x21b)](_0x2d299(0x20a),pinkjson[_0x2d299(0x22f)])[_0x2d299(0x21b)](_0x2d299(0x217),conn[_0x2d299(0x233)][_0x2d299(0x21f)])['replace']('{time}',time)[_0x2d299(0x21b)](_0x2d299(0x23a),tag),MessageType[_0x2d299(0x21e)],{'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});}}}}return;}else{if(msg['messageStubType']===0x28||msg[_0x2d299(0x21d)]===0x29){if(config['CALLB']==_0x2d299(0x206)){await conn[_0x2d299(0x239)](msg[_0x2d299(0x214)][_0x2d299(0x210)],_0x2d299(0x21a),MessageType['text']);return;}}else{if(msg[_0x2d299(0x21d)]===0x1b||msg[_0x2d299(0x21d)]===0x1f){const tag='@'+msg[_0x2d299(0x219)][0x0][_0x2d299(0x1f7)]('@')[0x0];var gb=await getMessage(msg[_0x2d299(0x214)][_0x2d299(0x210)]);if(gb!==![]){if(gb[_0x2d299(0x22a)]['includes'](_0x2d299(0x1f8))){let pp;try{pp=await conn[_0x2d299(0x20f)](msg[_0x2d299(0x219)][0x0]);}catch{pp=await conn['getProfilePicture']();}var pinkjson=await conn[_0x2d299(0x231)](msg[_0x2d299(0x214)]['remoteJid']),time=new Date()[_0x2d299(0x20e)]('HI',{'timeZone':'Asia/Kolkata'})[_0x2d299(0x1f7)]('\x20')[0x1];await axios[_0x2d299(0x1fc)](pp,{'responseType':_0x2d299(0x232)})[_0x2d299(0x226)](async _0x154ee6=>{var _0x50f675=_0x2d299;await conn[_0x50f675(0x239)](msg[_0x50f675(0x214)][_0x50f675(0x210)],_0x154ee6[_0x50f675(0x220)],MessageType[_0x50f675(0x200)],{'thumbnail':fs[_0x50f675(0x207)]('./media/image/wel.jpg'),'caption':gb[_0x50f675(0x22a)][_0x50f675(0x21b)](_0x50f675(0x1f8),'')[_0x50f675(0x21b)]('{gphead}',pinkjson['subject'])[_0x50f675(0x21b)](_0x50f675(0x202),pinkjson[_0x50f675(0x22b)])[_0x50f675(0x21b)](_0x50f675(0x20a),pinkjson[_0x50f675(0x22f)])[_0x50f675(0x21b)](_0x50f675(0x217),conn[_0x50f675(0x233)][_0x50f675(0x21f)])[_0x50f675(0x21b)]('{time}',time)[_0x50f675(0x21b)](_0x50f675(0x23a),tag),'contextInfo':{'mentionedJid':[msg[_0x50f675(0x219)][0x0]]}});});}else{if(gb['message'][_0x2d299(0x235)](_0x2d299(0x203))){const tag='@'+msg['messageStubParameters'][0x0][_0x2d299(0x1f7)]('@')[0x0];let gp;try{gp=await conn[_0x2d299(0x20f)](msg['key']['remoteJid']);}catch{gp=await conn['getProfilePicture']();}var time=new Date()[_0x2d299(0x20e)]('HI',{'timeZone':_0x2d299(0x201)})[_0x2d299(0x1f7)]('\x20')[0x1],rashijson=await conn[_0x2d299(0x231)](msg[_0x2d299(0x214)][_0x2d299(0x210)]);await axios[_0x2d299(0x1fc)](gp,{'responseType':_0x2d299(0x232)})['then'](async _0x371177=>{var _0x1aef60=_0x2d299;await conn[_0x1aef60(0x239)](msg[_0x1aef60(0x214)][_0x1aef60(0x210)],_0x371177[_0x1aef60(0x220)],MessageType[_0x1aef60(0x200)],{'thumbnail':fs[_0x1aef60(0x207)](_0x1aef60(0x22d)),'caption':gb[_0x1aef60(0x22a)]['replace']('{gp}','')[_0x1aef60(0x21b)]('{gphead}',rashijson[_0x1aef60(0x236)])[_0x1aef60(0x21b)]('{gpmaker}',rashijson['owner'])[_0x1aef60(0x21b)]('{gpdesc}',rashijson[_0x1aef60(0x22f)])[_0x1aef60(0x21b)](_0x1aef60(0x217),conn['user']['name'])[_0x1aef60(0x21b)](_0x1aef60(0x1fd),time)[_0x1aef60(0x21b)](_0x1aef60(0x23a),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});});}else{if(gb[_0x2d299(0x22a)][_0x2d299(0x235)](_0x2d299(0x20c))){var time=new Date()[_0x2d299(0x20e)]('HI',{'timeZone':_0x2d299(0x201)})['split']('\x20')[0x1];const tag='@'+msg[_0x2d299(0x219)][0x0]['split']('@')[0x0];var plkpinky=await axios[_0x2d299(0x1fc)](config[_0x2d299(0x205)],{'responseType':'arraybuffer'}),pinkjson=await conn['groupMetadata'](msg['key'][_0x2d299(0x210)]);await conn[_0x2d299(0x239)](msg[_0x2d299(0x214)]['remoteJid'],Buffer[_0x2d299(0x1f4)](plkpinky[_0x2d299(0x220)]),MessageType[_0x2d299(0x218)],{'thumbnail':fs[_0x2d299(0x207)](_0x2d299(0x22d)),'mimetype':Mimetype['gif'],'caption':gb[_0x2d299(0x22a)][_0x2d299(0x21b)]('{gif}','')['replace'](_0x2d299(0x212),pinkjson['subject'])[_0x2d299(0x21b)]('{gpmaker}',pinkjson['owner'])['replace'](_0x2d299(0x20a),pinkjson[_0x2d299(0x22f)])[_0x2d299(0x21b)]('{owner}',conn[_0x2d299(0x233)]['name'])[_0x2d299(0x21b)](_0x2d299(0x1fd),time)[_0x2d299(0x21b)](_0x2d299(0x23a),tag),'contextInfo':{'mentionedJid':[msg[_0x2d299(0x219)][0x0]]}});}else{const tag='@'+msg[_0x2d299(0x219)][0x0]['split']('@')[0x0];var time=new Date()[_0x2d299(0x20e)]('HI',{'timeZone':_0x2d299(0x201)})[_0x2d299(0x1f7)]('\x20')[0x1],pinkjson=await conn[_0x2d299(0x231)](msg[_0x2d299(0x214)][_0x2d299(0x210)]);await conn['sendMessage'](msg['key'][_0x2d299(0x210)],gb[_0x2d299(0x22a)][_0x2d299(0x21b)]('{gphead}',pinkjson[_0x2d299(0x236)])[_0x2d299(0x21b)](_0x2d299(0x202),pinkjson[_0x2d299(0x22b)])['replace'](_0x2d299(0x20a),pinkjson['desc'])[_0x2d299(0x21b)](_0x2d299(0x217),conn[_0x2d299(0x233)]['name'])[_0x2d299(0x21b)](_0x2d299(0x1fd),time)[_0x2d299(0x21b)]('{mention}',tag),MessageType[_0x2d299(0x21e)],{'contextInfo':{'mentionedJid':[msg[_0x2d299(0x219)][0x0]]}});}}}}return;}}}

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
