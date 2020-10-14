const Canvas = require('canvas');
const { splitMessage, Util } = require("discord.js");
const request = require("request");
const fs = require('fs');

var Crawler = require("crawler");

let rawdata = fs.readFileSync('./include/assets/json/game.json');
let Game = JSON.parse(rawdata);

module.exports = {
	async subredditimage(subreddits, message) {
		try {
			let URL = 'https://media3.giphy.com/media/26uf6qaxqHpYXgjWU/200.gif';
			let DiscordSupport = [".jpg", ".jpeg", ".JPG", ".JPEG", ".png", ".PNG", ".gif"];
			let RandomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
			let imgs = Math.floor(Math.random() * 80);

			if (fs.existsSync(`./include/assets/json/reddit/${RandomSubreddit}.json`)) {
				let rawdata = fs.readFileSync(`./include/assets/json/reddit/${RandomSubreddit}.json`);
				data = JSON.parse(rawdata);

				var mainObj = data.data.children;
				URL = mainObj[imgs].data.url;

				let ProperURL = false;

				let Tries = 0;
				while (!ProperURL) {
					for (let i = 0; i < DiscordSupport.length; i++) {
						if (URL.endsWith(DiscordSupport[i])) {
							ProperURL = true;
							break;
						}
					}

					if (!ProperURL) {
						imgs = Math.floor(Math.random() * 80);
						URL = mainObj[imgs].data.url;
					}

					Tries += 1;
					if (Tries > 10) {
						return message.reply("Couldn't find any images, please try again later!");
					}
				}

				return message.channel.send({
					embed: {
						title: `${mainObj[imgs].data.title}`,
						image: {
							url: URL,
						},
						color: "#8B0000",
						footer: {
							text: "Requested by " + message.author.tag,
							icon_url: message.author.displayAvatarURL()
						},
						timestamp: new Date()
					}
				});
			}

			let url = `https://www.reddit.com/r/${RandomSubreddit}/.json?sort=rising&t=hour&limit=80`;
			request({ method: 'GET', uri: url }, function (err, response, data) {
				if (err) {
					console.log(err, null);
					return message.reply("Something went wrong! Please try again later!");
				}

				try {
					data = JSON.parse(data);
					var mainObj = data.data.children;
					URL = mainObj[imgs].data.url;

					let ProperURL = false;

					let Tries = 0;
					while (!ProperURL) {
						for (let i = 0; i < DiscordSupport.length; i++) {
							if (URL.endsWith(DiscordSupport[i])) {
								ProperURL = true;
								break;
							}
						}

						if (!ProperURL) {
							imgs = Math.floor(Math.random() * 80);
							URL = mainObj[imgs].data.url;
						}

						Tries += 1;
						if (Tries > 10) {
							return message.reply("Couldn't find any images, please try again later!");
						}
					}

					return message.channel.send({
						embed: {
							title: `${mainObj[imgs].data.title}`,
							image: {
								url: URL,
							},
							color: "#8B0000",
							footer: {
								text: "Requested by " + message.author.tag,
								icon_url: message.author.displayAvatarURL()
							},
							timestamp: new Date()
						}
					});
				} catch (error) {
					console.log(error);
					return message.reply("Something went wrong! Please try again later!");
				}
			});

		} catch (error) {
			console.log(error);
			return message.reply("Something went wrong! Please try again later!");
		}
	},

	async refreshsubreddit() {
		let Rrawdata = fs.readFileSync('./include/assets/json/reddit.json');
		let Subreddit = JSON.parse(Rrawdata);
		let Subreddits = Subreddit["subreddits"];

		var c = new Crawler({
			encoding: null,
			jQuery: false,// set false to suppress warning message.
			callback: function (err, res, done) {
				if (err) {
					console.error(err.stack);
				} else {
					fs.createWriteStream(res.options.filename).write(res.body);
				}

				done();
			}
		});

		for (let i = 0; i < Subreddits.length; i++) {
			c.queue({
				uri: `https://www.reddit.com/r/${Subreddits[i]}/.json?sort=rising&t=hour&limit=80`,
				filename: `./include/assets/json/reddit/${Subreddits[i]}.json`
			});

			await this.delay(10000);
		}
	},

	applyText(canvas, text, splitcharacters) {
		const ctx = canvas.getContext('2d');

		// Declare a base size of the font
		let fontSize = 70;

		let duptext = text;

		const splittext = splitMessage(duptext, {
			maxLength: splitcharacters,
			char: " ",
			prepend: "",
			append: ""
		});

		duptext = "";
		splittext.forEach(async (m) => {
			duptext += m + "\n";
		});

		do {
			// Assign the font to the context and decrement it so it can be measured again
			ctx.font = `${fontSize -= 10}px sans-serif`;
			// Compare pixel width of the text to the canvas minus the approximate avatar size
		} while (ctx.measureText(duptext).width > canvas.width - 50);

		// Return the result to use in the actual canvas
		return ctx.font;
	},

	silhouette(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = 0;
			data.data[i + 1] = 0;
			data.data[i + 2] = 0;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	},

	contrast(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		const factor = (259 / 100) + 1;
		const intercept = 128 * (1 - factor);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = (data.data[i] * factor) + intercept;
			data.data[i + 1] = (data.data[i + 1] * factor) + intercept;
			data.data[i + 2] = (data.data[i + 2] * factor) + intercept;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	},

	desaturate(ctx, level, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				const dest = ((i * width) + j) * 4;
				const grey = Number.parseInt(
					(0.2125 * data.data[dest]) + (0.7154 * data.data[dest + 1]) + (0.0721 * data.data[dest + 2]), 10
				);
				data.data[dest] += level * (grey - data.data[dest]);
				data.data[dest + 1] += level * (grey - data.data[dest + 1]);
				data.data[dest + 2] += level * (grey - data.data[dest + 2]);
			}
		}
		ctx.putImageData(data, x, y);
		return ctx;
	},

	shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	},

	hasAlpha(image) {
		const canvas = Canvas.createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let hasAlphaPixels = false;
		for (let i = 3; i < data.data.length; i += 4) {
			if (data.data[i] < 255) {
				hasAlphaPixels = true;
				break;
			}
		}
		return hasAlphaPixels;
	},

	shortenText(ctx, text, maxWidth) {
		let shorten = false;
		while (ctx.measureText(`${text}...`).width > maxWidth) {
			if (!shorten) shorten = true;
			text = text.substr(0, text.length - 1);
		}
		return shorten ? `${text}...` : text;
	},

	firstUpperCase(text, split = ' ') {
		return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
	},

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	drawImageWithTint(ctx, image, color, x, y, width, height) {
		const { fillStyle, globalAlpha } = ctx;
		ctx.fillStyle = color;
		ctx.drawImage(image, x, y, width, height);
		ctx.globalAlpha = 0.5;
		ctx.fillRect(x, y, width, height);
		ctx.fillStyle = fillStyle;
		ctx.globalAlpha = globalAlpha;
	},

	jsapplyText(canvas, text) {
		const ctx = canvas.getContext('2d');

		// Declare a base size of the font
		let fontSize = 70;

		do {
			// Assign the font to the context and decrement it so it can be measured again
			ctx.font = `${fontSize -= 10}px sans-serif`;
			// Compare pixel width of the text to the canvas minus the approximate avatar size
		} while (ctx.measureText(text).width > canvas.width - 300);

		// Return the result to use in the actual canvas
		return ctx.font;
	},

	wrapText(ctx, text, maxWidth) {
		return new Promise(resolve => {
			if (ctx.measureText(text).width < maxWidth) return resolve([text]);
			if (ctx.measureText('W').width > maxWidth) return resolve(null);
			const words = text.split(' ');
			const lines = [];
			let line = '';
			while (words.length > 0) {
				let split = false;
				while (ctx.measureText(words[0]).width >= maxWidth) {
					const temp = words[0];
					words[0] = temp.slice(0, -1);
					if (split) {
						words[1] = `${temp.slice(-1)}${words[1]}`;
					} else {
						split = true;
						words.splice(1, 0, temp.slice(-1));
					}
				}
				if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
					line += `${words.shift()} `;
				} else {
					lines.push(line.trim());
					line = '';
				}
				if (words.length === 0) lines.push(line.trim());
			}
			return resolve(lines);
		});
	},

	distort(ctx, amplitude, x, y, width, height, strideLevel = 4) {
		const data = ctx.getImageData(x, y, width, height);
		const temp = ctx.getImageData(x, y, width, height);
		const stride = width * strideLevel;
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
				const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
				const dest = (j * stride) + (i * strideLevel);
				const src = ((j + ys) * stride) + ((i + xs) * strideLevel);
				data.data[dest] = temp.data[src];
				data.data[dest + 1] = temp.data[src + 1];
				data.data[dest + 2] = temp.data[src + 2];
			}
		}
		ctx.putImageData(data, x, y);
		return ctx;
	},

	greyscale(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
			data.data[i] = brightness;
			data.data[i + 1] = brightness;
			data.data[i + 2] = brightness;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	},

	centerImage(base, data) {
		const dataRatio = data.width / data.height;
		const baseRatio = base.width / base.height;
		let { width, height } = data;
		let x = 0;
		let y = 0;
		if (baseRatio < dataRatio) {
			height = data.height;
			width = base.width * (height / base.height);
			x = (data.width - width) / 2;
			y = 0;
		} else if (baseRatio > dataRatio) {
			width = data.width;
			height = base.height * (width / base.width);
			x = 0;
			y = (data.height - height) / 2;
		}
		return { x, y, width, height };
	},

	centerImagePart(data, maxWidth, maxHeight, widthOffset, heightOffest) {
		let { width, height } = data;
		if (width > maxWidth) {
			const ratio = maxWidth / width;
			width = maxWidth;
			height *= ratio;
		}
		if (height > maxHeight) {
			const ratio = maxHeight / height;
			height = maxHeight;
			width *= ratio;
		}
		const x = widthOffset + ((maxWidth / 2) - (width / 2));
		const y = heightOffest + ((maxHeight / 2) - (height / 2));
		return { x, y, width, height };
	},

	wrapText(ctx, text, maxWidth) {
		return new Promise(resolve => {
			if (ctx.measureText(text).width < maxWidth) return resolve([text]);
			if (ctx.measureText('W').width > maxWidth) return resolve(null);
			const words = text.split(' ');
			const lines = [];
			let line = '';
			while (words.length > 0) {
				let split = false;
				while (ctx.measureText(words[0]).width >= maxWidth) {
					const temp = words[0];
					words[0] = temp.slice(0, -1);
					if (split) {
						words[1] = `${temp.slice(-1)}${words[1]}`;
					} else {
						split = true;
						words.splice(1, 0, temp.slice(-1));
					}
				}
				if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
					line += `${words.shift()} `;
				} else {
					lines.push(line.trim());
					line = '';
				}
				if (words.length === 0) lines.push(line.trim());
			}
			return resolve(lines);
		});
	},

	canModifyQueue(member) {
		const { channel } = member.voice;
		const botChannel = member.guild.me.voice.channel;

		if (channel !== botChannel) {
			member.send("You need to join the voice channel first!").catch(console.error);
			return false;
		}

		return true;
	},

	msToTime(ms) {
		days = Math.floor(ms / 86400000); // 24*60*60*1000
		daysms = ms % 86400000; // 24*60*60*1000
		hours = Math.floor(daysms / 3600000); // 60*60*1000
		hoursms = ms % 3600000; // 60*60*1000
		minutes = Math.floor(hoursms / 60000); // 60*1000
		minutesms = ms % 60000; // 60*1000
		sec = Math.floor(minutesms / 1000);

		let str = "";
		if (days) str = str + days + "d ";
		if (hours) str = str + hours + "h ";
		if (minutes) str = str + minutes + "m ";
		if (sec) str = str + sec + "s ";

		return str;
	},

	makeid(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},

	moneyFormat(amount) {
		var formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		});

		return formatter.format(amount);
	},

	moneyFormatW(labelValue) {
		// Nine Zeroes for Billions
		return Math.abs(Number(labelValue)) >= 1.0e+9
			? parseFloat(Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"

			// Six Zeroes for Millions 
			: Math.abs(Number(labelValue)) >= 1.0e+6
				? parseFloat(Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"

				// Three Zeroes for Thousands
				: Math.abs(Number(labelValue)) >= 1.0e+3
					? parseFloat(Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
					: Math.abs(Number(labelValue));

	},

	shorten(text, maxLen = 2000) {
		return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
	},

	shuffle(array) {
		let counter = array.length;

		// While there are elements in the array
		while (counter > 0) {
			// Pick a random index
			let index = Math.floor(Math.random() * counter);

			// Decrease counter by 1
			counter--;

			// And swap the last element with it
			let temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}

		return array;
	},

	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	},

	embedURL(title, url, display) {
		return `[${title}](${url.replace(/\)/g, '%27')}${display ? ` "${display}"` : ''})`;
	},

	timeConverter(UNIX_timestamp) {
		var a = new Date(UNIX_timestamp * 1000);
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		var sec = a.getSeconds();
		var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
		return time;
	},

	blacklsited(message) {
		let rawdata = fs.readFileSync('./include/assets/json/blacklisted.json');
		let Blacklisted = JSON.parse(rawdata);

		let Guilds = Blacklisted["guilds"];
		let Users = Blacklisted["users"];

	},

	isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	},

	NotNumberCheck(value) {
		if (!this.isNumeric(value) || value === undefined || value === null) {
			value = 0;
		}
		return parseInt(value);
	},

	shuffleWord(word) {
		var shuffledWord = '';
		word = word.split('');
		while (word.length > 0) {
			shuffledWord += word.splice(word.length * Math.random() << 0, 1);
		}
		return shuffledWord;
	},

	wordArray(array, word) {
		if (isNaN(word)) {
			if (((array.indexOf(word.toLowerCase())) > -1)) {
				return true;
			}
		}
		else {
			if (((array.indexOf(word) > -1))) {
				return true;
			}
		}
		return false;
	},

	escapeHTML(Message) {
		Message = Message.replace(/&quot;/g, '"');
		Message = Message.replace(/&#039;/g, "'");
		Message = Message.replace(/&amp;/g, "&");
		Message = Message.replace(/&ouml;/g, "ö");
		Message = Message.replace(/&uuml;/g, "ü");
		Message = Message.replace(/&lt;/g, "<");
		Message = Message.replace(/&gt;/g, ">");
		Message = Message.replace(/&ecirc;/g, "ê");
		Message = Message.replace(/&eacute;/g, "ê");
		return Message;
	}
};
