const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const Canvas = require('canvas');
const Discord = require('discord.js');
const fs = require('fs');

let rawdata = fs.readFileSync('./include/assets/json/game.json');
let Game = JSON.parse(rawdata);

let rawdata2 = fs.readFileSync('./include/assets/json/jobs.json');
let Game2 = JSON.parse(rawdata2);

module.exports = {
  name: 'profile',
  description: "Gets the user's personal profile",
  aliases: ['pf'],
  usage: ' [user - Optional]',
  cooldown: 10,
  args: 0,
  catergory: 'Economy',
  async execute(message, args, client) {
    try {
      let user = message.author;
      let Bases = Game.data["Bases"];
      let JobArray = Game2["data"];
      if (message.mentions.members.first()) {
        user = message.mentions.members.first().user;
      }

      let BioTest = await db.has(`${user.id}_bio`);
      if (!BioTest) {
        await db.set(`${user.id}_bio`, "None");
      }

      let bio = await db.get(`${user.id}_bio`);
      if (!bio) {
        bio = "None";
      }

      let balance = await db.get(`${user.id}_balance`);
      if (!balance) {
        balance = 0;
      }

      let Vault = Util.NotNumberCheck(await db.get(`${user.id}_vault`));
      let Length = Vault.toString().length;
      let Dollars = "";
      for (let i = 0; i < Length; i++) {
        Dollars += "$";
      }

      let UserBase = await db.get(`${user.id}_base`);
      let UserJob = await db.get(`${user.id}_job`);
      let UserPromotion = await db.get(`${user.id}_promotion`);

      let Background = "./img/profile/card-baseless-min.png";
      let Background2 = "./img/jobs/rebel_optimized.png";
      let Background3 = "./img/rank/chevron_optimized.png";

      if (UserBase != -1) {
        Background = `./img/profile/card-${Bases[UserBase]}-min.png`;
      }

      if (UserJob != -1) {
        Background2 = `./img/jobs/${JobArray[UserJob]}_optimized.png`;
      }

      if (UserPromotion != 0) {
        Background3 = `./img/rank/chevron-${UserPromotion}_optimized.png`;
      }

      const canvas = Canvas.createCanvas(1920, 1480);
      const ctx = canvas.getContext('2d');

      const background = await Canvas.loadImage(Background);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      const background2 = await Canvas.loadImage(Background2);
      ctx.drawImage(background2, 345, 770, 300, 300);

      const background3 = await Canvas.loadImage(Background3);
      ctx.drawImage(background3, 655, 1047, 119, 119);

      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(bio, 830, 680 + 135);

      ctx.font = '70px Paladins';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(user.username, 600, 530 + 135);

      ctx.font = '70px Undertale Sans';
      ctx.fillStyle = '#000000';
      ctx.fillText(Util.moneyFormatW(balance), 955, 840 + 135);
      ctx.fillText(Dollars, 955, 990 + 135);

      let Levels = Util.NotNumberCheck(await db.get(`${user.id}_level`));
      let Experience = Util.NotNumberCheck(await db.get(`${user.id}_experience`));
      let Messages = Util.NotNumberCheck(await db.get(`${user.id}_messages`));

      let Luck = Util.NotNumberCheck(await db.get(`${user.id}_luck`));
      Luck += Util.NotNumberCheck(await db.get(`${user.id}_baseluck`));

      let Defense = Util.NotNumberCheck(await db.get(`${user.id}_defense`));
      Defense += Util.NotNumberCheck(await db.get(`${user.id}_basedefense`));

      ctx.textAlign = "center";
      ctx.fillText(Levels, 904, 1350);
      ctx.fillText(Defense, 1085, 1350);
      ctx.fillText(Luck, 1255, 1350);

      ctx.font = '35px Undertale Sans';
      ctx.textAlign = "left";
      ctx.fillText(Messages, 323, 1310);
      ctx.fillText(Experience, 323, 1380);

      ctx.beginPath();
      ctx.arc(904, 1329, 71, 0, Math.PI * 2, false);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(1085, 1329, 71, 0, Math.PI * 2, false);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(1255, 1329, 71, 0, Math.PI * 2, false);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(331, 464, 250, 0, Math.PI * 2, true);
      ctx.clip();

      const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png' }));
      ctx.drawImage(avatar, 71, 208, 525, 525);

      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile.png');

      message.channel.send(attachment);
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
