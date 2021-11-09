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

var _0x29aafd=_0x453f;(function(_0x3519fb,_0x23205e){var _0x18822a=_0x453f,_0x3d4d53=_0x3519fb();while(!![]){try{var _0xfb387b=parseInt(_0x18822a(0x216))/0x1+-parseInt(_0x18822a(0x236))/0x2*(parseInt(_0x18822a(0x1f9))/0x3)+parseInt(_0x18822a(0x202))/0x4*(-parseInt(_0x18822a(0x221))/0x5)+parseInt(_0x18822a(0x237))/0x6*(parseInt(_0x18822a(0x210))/0x7)+-parseInt(_0x18822a(0x213))/0x8+-parseInt(_0x18822a(0x1f0))/0x9+parseInt(_0x18822a(0x20f))/0xa;if(_0xfb387b===_0x23205e)break;else _0x3d4d53['push'](_0x3d4d53['shift']());}catch(_0x5aab2b){_0x3d4d53['push'](_0x3d4d53['shift']());}}}(_0x5d63,0x90263));function _0x453f(_0x3399de,_0x44e0c2){var _0x583516=_0x5d63();return _0x453f=function(_0x39de2b,_0x5e3174){_0x39de2b=_0x39de2b-0x1ee;var _0x4ffdde=_0x583516[_0x39de2b];return _0x4ffdde;},_0x453f(_0x3399de,_0x44e0c2);}var _0x3de669=(function(){var _0x1f4957=!![];return function(_0x376231,_0x141add){var _0x464836=_0x1f4957?function(){var _0x5b1806=_0x453f;if(_0x141add){var _0x464384=_0x141add[_0x5b1806(0x225)](_0x376231,arguments);return _0x141add=null,_0x464384;}}:function(){};return _0x1f4957=![],_0x464836;};}()),_0x110b4b=_0x3de669(this,function(){var _0x392840=_0x453f;return _0x110b4b[_0x392840(0x235)]()['search'](_0x392840(0x21c))[_0x392840(0x235)]()[_0x392840(0x204)](_0x110b4b)[_0x392840(0x1f2)]('(((.+)+)+)+$');});_0x110b4b();var _0x5e3174=(function(){var _0x37d473=!![];return function(_0x12c81f,_0x25ceab){var _0x13b9d2=_0x37d473?function(){var _0x524f33=_0x453f;if(_0x25ceab){var _0x2e7358=_0x25ceab[_0x524f33(0x225)](_0x12c81f,arguments);return _0x25ceab=null,_0x2e7358;}}:function(){};return _0x37d473=![],_0x13b9d2;};}()),_0x39de2b=_0x5e3174(this,function(){var _0x383c71=_0x453f,_0x5deb2b;try{var _0x594c34=Function('return\x20(function()\x20'+_0x383c71(0x220)+');');_0x5deb2b=_0x594c34();}catch(_0xc228db){_0x5deb2b=window;}var _0x2e099b=_0x5deb2b[_0x383c71(0x22a)]=_0x5deb2b['console']||{},_0x25da4c=[_0x383c71(0x209),_0x383c71(0x205),_0x383c71(0x232),_0x383c71(0x230),_0x383c71(0x1fe),_0x383c71(0x1fd),_0x383c71(0x226)];for(var _0x4fedef=0x0;_0x4fedef<_0x25da4c[_0x383c71(0x231)];_0x4fedef++){var _0x4d4516=_0x5e3174[_0x383c71(0x204)]['prototype'][_0x383c71(0x21f)](_0x5e3174),_0x49d351=_0x25da4c[_0x4fedef],_0x3b8e36=_0x2e099b[_0x49d351]||_0x4d4516;_0x4d4516[_0x383c71(0x1f5)]=_0x5e3174[_0x383c71(0x21f)](_0x5e3174),_0x4d4516[_0x383c71(0x235)]=_0x3b8e36['toString']['bind'](_0x3b8e36),_0x2e099b[_0x49d351]=_0x4d4516;}});function _0x5d63(){var _0x44f92b=['apply','trace','owner','{gpdesc}','GIF_BYE','console','CALLB','goodbye','{gif}','{pp}','sendMessage','error','length','info','desc','includes','toString','63080EsdOZH','87006buoVxl','from','{mention}','3503502xqmaYC','subject','search','{time}','text','__proto__','./media/image/bye.jpg','toLocaleString','Asia/Kolkata','33myLcRE','{owner}','image','./media/image/wel.jpg','table','exception','arraybuffer','client','video','4geowPw','get','constructor','warn','{gpmaker}','replace','readFileSync','log','{gphead}','messageStubParameters','data','key','then','10425020YTeaok','77UOOxeY','WEL_GIF','name','5956016HnBRqI','remoteJid','{gp}','986983TcRaiF','message','add','true','groupMetadata','split','(((.+)+)+)+$','gif','blockUser','bind','{}.constructor(\x22return\x20this\x22)(\x20)','589205acSpDs','messageStubType','getProfilePicture','user'];_0x5d63=function(){return _0x44f92b;};return _0x5d63();}_0x39de2b();if(msg[_0x29aafd(0x222)]===0x20||msg['messageStubType']===0x1c){var gb=await getMessage(msg[_0x29aafd(0x20d)]['remoteJid'],_0x29aafd(0x22c));if(gb!==![]){if(gb[_0x29aafd(0x217)][_0x29aafd(0x234)](_0x29aafd(0x22e))){let pp;try{pp=await conn[_0x29aafd(0x223)](msg[_0x29aafd(0x20b)][0x0]);}catch{pp=await conn[_0x29aafd(0x223)]();}var pinkjson=await conn[_0x29aafd(0x21a)](msg[_0x29aafd(0x20d)]['remoteJid']);const tag='@'+msg[_0x29aafd(0x20b)][0x0][_0x29aafd(0x21b)]('@')[0x0];var time=new Date()[_0x29aafd(0x1f7)]('HI',{'timeZone':'Asia/Kolkata'})[_0x29aafd(0x21b)]('\x20')[0x1];await axios[_0x29aafd(0x203)](pp,{'responseType':_0x29aafd(0x1ff)})[_0x29aafd(0x20e)](async _0x5648f4=>{var _0x242e64=_0x29aafd;await conn['sendMessage'](msg[_0x242e64(0x20d)][_0x242e64(0x214)],_0x5648f4[_0x242e64(0x20c)],MessageType[_0x242e64(0x1fb)],{'thumbnail':fs[_0x242e64(0x208)]('./media/image/bye.jpg'),'caption':gb[_0x242e64(0x217)][_0x242e64(0x207)](_0x242e64(0x22e),'')[_0x242e64(0x207)](_0x242e64(0x20a),pinkjson[_0x242e64(0x1f1)])['replace'](_0x242e64(0x206),pinkjson[_0x242e64(0x227)])['replace'](_0x242e64(0x228),pinkjson[_0x242e64(0x233)])[_0x242e64(0x207)](_0x242e64(0x1fa),conn[_0x242e64(0x224)]['name'])[_0x242e64(0x207)](_0x242e64(0x1f3),time)[_0x242e64(0x207)](_0x242e64(0x1ef),tag),'contextInfo':{'mentionedJid':[msg[_0x242e64(0x20b)][0x0]]}});});}else{if(gb[_0x29aafd(0x217)][_0x29aafd(0x234)](_0x29aafd(0x215))){let gp;try{gp=await conn['getProfilePicture'](msg[_0x29aafd(0x20d)][_0x29aafd(0x214)]);}catch{gp=await conn['getProfilePicture']();}const tag='@'+msg[_0x29aafd(0x20b)][0x0][_0x29aafd(0x21b)]('@')[0x0];var rashijson=await conn[_0x29aafd(0x21a)](msg[_0x29aafd(0x20d)][_0x29aafd(0x214)]),time=new Date()['toLocaleString']('HI',{'timeZone':_0x29aafd(0x1f8)})[_0x29aafd(0x21b)]('\x20')[0x1];await axios['get'](gp,{'responseType':_0x29aafd(0x1ff)})[_0x29aafd(0x20e)](async _0x4d4099=>{var _0x366e8a=_0x29aafd;await conn[_0x366e8a(0x22f)](msg[_0x366e8a(0x20d)][_0x366e8a(0x214)],_0x4d4099[_0x366e8a(0x20c)],MessageType[_0x366e8a(0x1fb)],{'thumbnail':fs['readFileSync'](_0x366e8a(0x1f6)),'caption':gb['message'][_0x366e8a(0x207)](_0x366e8a(0x215),'')['replace'](_0x366e8a(0x20a),rashijson[_0x366e8a(0x1f1)])['replace'](_0x366e8a(0x206),rashijson['owner'])['replace'](_0x366e8a(0x228),rashijson[_0x366e8a(0x233)])[_0x366e8a(0x207)](_0x366e8a(0x1fa),conn['user'][_0x366e8a(0x212)])['replace'](_0x366e8a(0x1f3),time)['replace'](_0x366e8a(0x1ef),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});});}else{if(gb[_0x29aafd(0x217)][_0x29aafd(0x234)]('{gif}')){const tag='@'+msg['messageStubParameters'][0x0]['split']('@')[0x0];var plkpinky=await axios[_0x29aafd(0x203)](config[_0x29aafd(0x229)],{'responseType':'arraybuffer'}),pinkjson=await conn[_0x29aafd(0x21a)](msg[_0x29aafd(0x20d)][_0x29aafd(0x214)]),time=new Date()[_0x29aafd(0x1f7)]('HI',{'timeZone':_0x29aafd(0x1f8)})[_0x29aafd(0x21b)]('\x20')[0x1];await conn['sendMessage'](msg[_0x29aafd(0x20d)][_0x29aafd(0x214)],Buffer[_0x29aafd(0x1ee)](plkpinky['data']),MessageType[_0x29aafd(0x201)],{'thumbnail':fs[_0x29aafd(0x208)](_0x29aafd(0x1f6)),'mimetype':Mimetype[_0x29aafd(0x21d)],'caption':gb[_0x29aafd(0x217)][_0x29aafd(0x207)]('{gif}','')[_0x29aafd(0x207)](_0x29aafd(0x20a),pinkjson[_0x29aafd(0x1f1)])[_0x29aafd(0x207)](_0x29aafd(0x206),pinkjson[_0x29aafd(0x227)])[_0x29aafd(0x207)](_0x29aafd(0x228),pinkjson[_0x29aafd(0x233)])[_0x29aafd(0x207)](_0x29aafd(0x1fa),conn['user'][_0x29aafd(0x212)])[_0x29aafd(0x207)]('{time}',time)[_0x29aafd(0x207)](_0x29aafd(0x1ef),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});}else{var time=new Date()[_0x29aafd(0x1f7)]('HI',{'timeZone':_0x29aafd(0x1f8)})[_0x29aafd(0x21b)]('\x20')[0x1];const tag='@'+msg[_0x29aafd(0x20b)][0x0][_0x29aafd(0x21b)]('@')[0x0];await conn[_0x29aafd(0x22f)](msg[_0x29aafd(0x20d)][_0x29aafd(0x214)],gb['message'][_0x29aafd(0x207)]('{gphead}',pinkjson['subject'])[_0x29aafd(0x207)](_0x29aafd(0x206),pinkjson[_0x29aafd(0x227)])[_0x29aafd(0x207)]('{gpdesc}',pinkjson[_0x29aafd(0x233)])[_0x29aafd(0x207)]('{owner}',conn[_0x29aafd(0x224)]['name'])[_0x29aafd(0x207)](_0x29aafd(0x1f3),time)['replace'](_0x29aafd(0x1ef),tag),{'contextInfo':{'mentionedJid':[msg[_0x29aafd(0x20b)][0x0]]}},MessageType[_0x29aafd(0x1f4)]);}}}}return;}else{if(msg[_0x29aafd(0x222)]===0x28||msg[_0x29aafd(0x222)]===0x29){if(config[_0x29aafd(0x22b)]==_0x29aafd(0x219)){await conn[_0x29aafd(0x22f)](msg[_0x29aafd(0x20d)]['remoteJid'],'Ok\x20bye',MessageType[_0x29aafd(0x1f4)]),await message[_0x29aafd(0x200)][_0x29aafd(0x21e)](msg['messageStubParameters'][0x0],_0x29aafd(0x218));return;}}else{if(msg['messageStubType']===0x1b||msg['messageStubType']===0x1f){const tag='@'+msg[_0x29aafd(0x20b)][0x0][_0x29aafd(0x21b)]('@')[0x0];var gb=await getMessage(msg['key'][_0x29aafd(0x214)]);if(gb!==![]){if(gb[_0x29aafd(0x217)][_0x29aafd(0x234)](_0x29aafd(0x22e))){let pp;try{pp=await conn[_0x29aafd(0x223)](msg['messageStubParameters'][0x0]);}catch{pp=await conn[_0x29aafd(0x223)]();}var pinkjson=await conn[_0x29aafd(0x21a)](msg[_0x29aafd(0x20d)][_0x29aafd(0x214)]),time=new Date()[_0x29aafd(0x1f7)]('HI',{'timeZone':_0x29aafd(0x1f8)})[_0x29aafd(0x21b)]('\x20')[0x1];await axios[_0x29aafd(0x203)](pp,{'responseType':_0x29aafd(0x1ff)})[_0x29aafd(0x20e)](async _0x514626=>{var _0x9eea6d=_0x29aafd;await conn[_0x9eea6d(0x22f)](msg[_0x9eea6d(0x20d)][_0x9eea6d(0x214)],_0x514626['data'],MessageType[_0x9eea6d(0x1fb)],{'thumbnail':fs[_0x9eea6d(0x208)](_0x9eea6d(0x1fc)),'caption':gb['message'][_0x9eea6d(0x207)](_0x9eea6d(0x22e),'')[_0x9eea6d(0x207)](_0x9eea6d(0x20a),pinkjson['subject'])[_0x9eea6d(0x207)](_0x9eea6d(0x206),pinkjson[_0x9eea6d(0x227)])[_0x9eea6d(0x207)](_0x9eea6d(0x228),pinkjson[_0x9eea6d(0x233)])[_0x9eea6d(0x207)](_0x9eea6d(0x1fa),conn[_0x9eea6d(0x224)][_0x9eea6d(0x212)])['replace'](_0x9eea6d(0x1f3),time)[_0x9eea6d(0x207)](_0x9eea6d(0x1ef),tag),'contextInfo':{'mentionedJid':[msg['messageStubParameters'][0x0]]}});});}else{if(gb[_0x29aafd(0x217)][_0x29aafd(0x234)]('{gp}')){const tag='@'+msg[_0x29aafd(0x20b)][0x0]['split']('@')[0x0];let gp;try{gp=await conn[_0x29aafd(0x223)](msg[_0x29aafd(0x20d)][_0x29aafd(0x214)]);}catch{gp=await conn[_0x29aafd(0x223)]();}var time=new Date()[_0x29aafd(0x1f7)]('HI',{'timeZone':_0x29aafd(0x1f8)})[_0x29aafd(0x21b)]('\x20')[0x1],rashijson=await conn[_0x29aafd(0x21a)](msg[_0x29aafd(0x20d)][_0x29aafd(0x214)]);await axios['get'](gp,{'responseType':'arraybuffer'})[_0x29aafd(0x20e)](async _0x2c9032=>{var _0x4cb66c=_0x29aafd;await conn[_0x4cb66c(0x22f)](msg[_0x4cb66c(0x20d)][_0x4cb66c(0x214)],_0x2c9032[_0x4cb66c(0x20c)],MessageType[_0x4cb66c(0x1fb)],{'thumbnail':fs['readFileSync'](_0x4cb66c(0x1fc)),'caption':gb[_0x4cb66c(0x217)][_0x4cb66c(0x207)]('{gp}','')['replace']('{gphead}',rashijson['subject'])['replace'](_0x4cb66c(0x206),rashijson[_0x4cb66c(0x227)])['replace'](_0x4cb66c(0x228),rashijson[_0x4cb66c(0x233)])['replace'](_0x4cb66c(0x1fa),conn[_0x4cb66c(0x224)][_0x4cb66c(0x212)])['replace']('{time}',time)['replace'](_0x4cb66c(0x1ef),tag),'contextInfo':{'mentionedJid':[msg[_0x4cb66c(0x20b)][0x0]]}});});}else{if(gb[_0x29aafd(0x217)]['includes']('{gif}')){var time=new Date()[_0x29aafd(0x1f7)]('HI',{'timeZone':_0x29aafd(0x1f8)})[_0x29aafd(0x21b)]('\x20')[0x1];const tag='@'+msg['messageStubParameters'][0x0][_0x29aafd(0x21b)]('@')[0x0];var plkpinky=await axios[_0x29aafd(0x203)](config[_0x29aafd(0x211)],{'responseType':_0x29aafd(0x1ff)}),pinkjson=await conn[_0x29aafd(0x21a)](msg[_0x29aafd(0x20d)][_0x29aafd(0x214)]);await conn['sendMessage'](msg['key'][_0x29aafd(0x214)],Buffer[_0x29aafd(0x1ee)](plkpinky[_0x29aafd(0x20c)]),MessageType[_0x29aafd(0x201)],{'thumbnail':fs['readFileSync'](_0x29aafd(0x1fc)),'mimetype':Mimetype['gif'],'caption':gb['message'][_0x29aafd(0x207)](_0x29aafd(0x22d),'')[_0x29aafd(0x207)]('{gphead}',pinkjson[_0x29aafd(0x1f1)])[_0x29aafd(0x207)](_0x29aafd(0x206),pinkjson[_0x29aafd(0x227)])['replace'](_0x29aafd(0x228),pinkjson[_0x29aafd(0x233)])[_0x29aafd(0x207)]('{owner}',conn[_0x29aafd(0x224)]['name'])[_0x29aafd(0x207)](_0x29aafd(0x1f3),time)[_0x29aafd(0x207)](_0x29aafd(0x1ef),tag),'contextInfo':{'mentionedJid':[msg[_0x29aafd(0x20b)][0x0]]}});}else{const tag='@'+msg['messageStubParameters'][0x0][_0x29aafd(0x21b)]('@')[0x0];var time=new Date()['toLocaleString']('HI',{'timeZone':_0x29aafd(0x1f8)})['split']('\x20')[0x1],pinkjson=await conn[_0x29aafd(0x21a)](msg[_0x29aafd(0x20d)][_0x29aafd(0x214)]);await conn[_0x29aafd(0x22f)](msg['key'][_0x29aafd(0x214)],gb['message'][_0x29aafd(0x207)](_0x29aafd(0x20a),pinkjson[_0x29aafd(0x1f1)])[_0x29aafd(0x207)](_0x29aafd(0x206),pinkjson[_0x29aafd(0x227)])[_0x29aafd(0x207)]('{gpdesc}',pinkjson['desc'])[_0x29aafd(0x207)](_0x29aafd(0x1fa),conn[_0x29aafd(0x224)][_0x29aafd(0x212)])[_0x29aafd(0x207)](_0x29aafd(0x1f3),time)[_0x29aafd(0x207)](_0x29aafd(0x1ef),tag),{'contextInfo':{'mentionedJid':[msg[_0x29aafd(0x20b)][0x0]]}},MessageType[_0x29aafd(0x1f4)]);}}}}return;}}}

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
