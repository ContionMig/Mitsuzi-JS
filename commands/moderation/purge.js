const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'purge',
  description: 'Purges 2 - 100 messages in the channel',
  aliases: ['deletemessage', 'delete'],
  usage: '[number]',
  cooldown: 2,
  args: 1,
  catergory: 'Moderation',
  async execute(message, args, client) {
    try {
      let DeleteMessage = args[0];
      if (isNaN(DeleteMessage)) {
        return message.reply("Please make sure you enter a valid number");
      }

      if (DeleteMessage > 100 || DeleteMessage < 2) {
        return message.reply("Please make sure the range is 3 - 100 messages")
      }

      if (!message.member.hasPermission('ADMINISTRATOR') ||
        !message.member.hasPermission('MANAGE_MESSAGES')) {
        return message.reply("Please make sure you have administrator/manage messages perms!")
      }

      await message.channel.bulkDelete(DeleteMessage).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
