const Util = require('../../util/MitUtil.js');
var request = require('request');
const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'python',
  description: 'The bot will try to compile the python code given',
  aliases: ['python3', 'py'],
  usage: ' [code]',
  cooldown: 2,
  args: -1,
  catergory: 'Others',
  async execute(message, args, client) {
    try {
      let Code = args.join(" ");
      while (Code.includes("`")) {
        Code = Code.replace("`", "");
      }

      var program = {
        script: Code,
        language: "python3",
        versionIndex: "0",
        clientId: config.jdoodleclientId,
        clientSecret: config.jdoodleclientSecret
      };

      request({
        url: 'https://api.jdoodle.com/v1/execute',
        method: "POST",
        json: program
      },

        function (error, response, body) {
          if (response && response.statusCode == 200) {
            let Return = "";
            Return += "Memory: ``" + body.memory + "``\n";
            Return += "CPU Time: ``" + body.cpuTime + "``\n";
            Return += "Output:\n```" + body.output + "```";

            return message.channel.send({
              embed: {
                title: `Python Code Compiler`,
                description: Return,
                color: "#8B0000",
                footer: {
                  text: "Requested by " + message.author.tag,
                  icon_url: message.author.displayAvatarURL()
                },
                timestamp: new Date()
              }
            });
          }

          message.reply("Unknown Error! Please contact owner");
        });
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
