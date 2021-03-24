//This is my first time using classes
const { Client, Collection } = require("discord.js");
const CommandManager = require('./modules/commandManager');
const WelcomeListener = require('./modules/welcomeListener');
const QueueManager = require('./modules/queueManager')
require('./db/db');
require('dotenv').config();


//Main Class
class KayaBot extends Client {
    constructor(options) {
        super(options);
        this.prefix = options.prefix;
        this.commands = new CommandManager(options.commandsPath)
        this.welcomeListener = new WelcomeListener()
        this.queue = new Map();

        this.smashLevels = [
            60, 70, 80, 110, 160, 210, 280, 360, 450, 550, 670, 790, 930, 1080, 1250, 1420, 1610, 1810, 2020, 2250,
            70, 80, 100, 140, 190, 250, 330, 430, 540, 660, 800, 950, 1120, 1300, 1500, 1710, 1940, 2180, 2430, 2700,
            80, 90, 120, 160, 230, 310, 410, 530, 670, 820, 1000, 1190, 1400, 1630, 1880, 2140, 2430, 2730, 3050, 3390,
            90, 100, 130, 190, 270, 370, 490, 630, 800, 990, 1200, 1430, 1710, 1960, 2260, 2580, 2920, 3290, 3670, 4080, 
            100, 110, 150, 220, 320, 440, 590, 770, 970, 1200, 1460, 1750, 2060, 2400, 2770, 3160, 3580, 4030, 4510, 5010,
            110, 120, 170, 240, 340, 460, 620, 800, 1020, 1260, 1530, 1830, 2160, 2510, 2890, 3300, 3740, 4210, 4700, 5220
        ]
    }

    login(token) {
        this._setupClient()
        return super.login(token);
    }

    _setupClient() {
        this.on('message', message => {
            if (message.author.bot || !message.content.startsWith(this.prefix)) return;
            
            const args = message.content.slice(this.prefix.length).split(/ +/);
            const command = args.shift().toLowerCase();
            try {
                if (command != '') {
                    this.commands.get(command).execute(message, args);
                }
                else {
                    this.commands.get('help').execute(message, args);
                }
            } catch (error) {
                console.error(error);
                message.channel.send("No such command :c");
            }
        });

        //Listener for k!welcome
        this.on('guildMemberAdd', member => {
            this.welcomeListener.listen(member);
        })

        this.on('ready', () => console.log('Ready'))
    }
}

//Starting The Bot
let kayaBot = new KayaBot({
    presence: {
        activity: {
            name: "k!help"
        }	
    }, 
    prefix: process.env.BOT_PREFIX,
    commandsPath: './commands'
}).login(process.env.BOT_TOKEN)