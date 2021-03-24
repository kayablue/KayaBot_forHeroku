const { MessageCollector } = require('discord.js');
const KayaEmbed = require('../modules/kayaEmbed');
const Command = require('../modules/command');

module.exports = new Command('smashcalc', 'Smash Heroes EXP Calculator', '', 'hypixel', async (message, args) => {
    let calcData = [];

    // FUNCTIONS START
    function awaitMessage() {
        let collector = new MessageCollector(message.channel, response => 
            !response.author.bot && 
            message.author.username == response.author.username &&
            typeof parseInt(response.content) == 'number',{
           max: 1, time: 30000
        })

        collector.on('collect', message => {
            calcData.push(message.content);
        })
        //I mastered promises yaay
        return new Promise((resolve, reject) => {
            collector.on("end", () => {
                resolve('yes')
            } );
        })
        
    }

    function makeEmbed(text) {
        return new KayaEmbed({
            title: text, footer: { text: '' }
        })
    }

    //This code has been copied from kayastats so the variable names are fucked up
    function calculateExp(currentLevel, currentEXP, desiredLevel, EXPGain) {
        let response;


        if (currentLevel == "" || desiredLevel == "" || EXPGain == "") {

            if (currentLevel >= 0 &&
            currentLevel < 120 &&
            currentLevel < desiredLevel &&
            desiredLevel >= 0 &&
            desiredLevel <= 120 &&
            EXPGain > 0 &&
            currentEXP >= 0 &&
            currentEXP < message.client.smashLevels[currentLevel])
            {

                let expNeeded = message.client.smashLevels.slice(currentLevel, desiredLevel - currentLevel).reduce((a, b) => a + b, 0) - currentEXP;
                let gamesNeeded = Math.ceil(expNeeded / EXPGain);

                response = `You need ${gamesNeeded.toLocaleString("ru-RU")} games`;
            }
            else {
                response = "Invalid Number Format";
            }    
        }
        else {
            response = "Uhhh, characters?";
        }
        
        
        return response;
    }
    //FUNCTIONS END

    //(day 2) OWO IT WORKS
    message.channel.send(makeEmbed("Type Your Current Level (From 0 to 119)"))

    await awaitMessage()
    message.channel.send(makeEmbed("Type Your Current EXP"))    

    await awaitMessage()
    message.channel.send(makeEmbed("Type Your Desired Level (From 1 to 120)"))

    await awaitMessage()
    message.channel.send(makeEmbed("Type EXP Gain Per Game"))

    await awaitMessage();
    
    //parseInt() so you can type 300lvl instead of 300 etc.
    currentLevel = parseInt(calcData[0]);
    currentEXP = parseInt(calcData[1]);
    desiredLevel = parseInt(calcData[2]);
    EXPGain = parseInt(calcData[3]);

    let response = calculateExp(currentLevel, currentEXP, desiredLevel, EXPGain)
    message.channel.send(makeEmbed(response));
    
})
