const Util = require('../../util/MitUtil.js');
const axios = require('axios');
const Discord = require("discord.js");

module.exports = {
  name: 'ipinfo',
  description: "Gets info about the IP address",
  aliases: ['ip', 'ipadress'],
  usage: ' [ip]',
  cooldown: 2,
  args: 0,
  catergory: 'Utility',
  async execute(message, args, client) {
    try {
      const Discord = require("discord.js");
      if (!args[0]) return message.reply("Please input a valid ip address!")

      this.getIPINFO(args[0]).then(response => {
        if (response.data.status === "success") {
          let embedStats = new Discord.MessageEmbed()
            .setTitle(`IP Information`)
            .setColor("#8B0000")
            .setDescription(`**Moblie:** ${response.data.mobile}\n**Proxy:** ${response.data.proxy}`)
            .addField("Internet Service Provider:", `${response.data.isp}`, true)
            .addField("AS Numer and Organization:", `${response.data.as}`, true)
            .addField("continent:", `${response.data.continent}`, true)
            .addField("Country:", `${response.data.country}`, true)
            .addField("City:", `${response.data.city}`, true)
            .addField("Timezone:", `${response.data.timezone}`, true)
            .addField("Lat & Lon:", `Lat: ${response.data.lat} | Lon: ${response.data.lon}`, true)
            .addField("Currency:", `${response.data.currency}`, true)
            .setFooter("Requested by " + message.author.tag)
            .setTimestamp()

          return message.channel.send(embedStats);
        }
        else {
          return message.channel.send("Please enter a valid ip address!");
        }
      });
    }
    catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  },
  async getIPINFO(ip) {
    try {
      return axios.get(`http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,currency,isp,org,as,asname,reverse,mobile,proxy,query`, { responseType: 'json', timeout: 10000 });
    } catch (e) {
      console.log(e);
    }
  }
};
