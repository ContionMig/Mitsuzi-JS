const Util = require('../../util/MitUtil.js');
const weather = require("weather-js");
const Discord = require("discord.js");

module.exports = {
    name: 'weather',
    description: "Gets the weather report for the area/country",
    aliases: ['temperature', 'climate'],
    usage: ' [country]',
    cooldown: 2,
    args: 1,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
            let result;
            weather.find({ search: args.join(" "), degreeType: "C" }, function (err, result) {
                if (!result[0]) return message.reply("Could not find the location provided!");

                var current = result[0].current //Variable for the current part of the JSON Output
                var location = result[0].location //This is a variable for the location part of the JSON Output

                const serverembed = new Discord.MessageEmbed()
                    .setDescription(`**${current.skytext}**`) //How the sky looks like
                    .setAuthor(`Weather for ${current.observationpoint}`) //Shows the current location of the weater
                    .setThumbnail(current.imageUrl) //Sets thumbnail of the embed
                    .setColor("#8B0000") //Sets the color of the embed
                    .addField("Timezone", `UTC${location.timezone}`, true) //Shows the timezone
                    .addField("Degree Type", location.degreetype, true) //Shows the degrees in Celcius
                    .addField("Temperature", `${current.temperature}`, true)
                    .addField("Feels like", `${current.feelslike} Degrees`, true)
                    .addField("Winds", current.winddisplay, true)
                    .addField("Humidity", ` ${current.humidity}%`, true)
                    .addField("Day", `${current.day}`, true)
                    .addField("Date", `${current.date}`, true)
                    .setFooter("Requested by " + message.author.tag);

                message.channel.send(serverembed)
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
