const Command = require('../modules/command');
const axios = require('axios');
const KayaEmbed = require('../modules/kayaEmbed');

module.exports = new Command('bb', 'Build Battle Stats', 'k!bb Kawaiinex', 'hypixel', async(message, args) => {
    try {
        let data =
            (await axios.get('https://api.slothpixel.me/api/players/' + args[0], {
                params: {
                    key: process.env.HYPIXEL_API_KEY
                }
            })).data;
        let buildBattle = data.stats.BuildBattle;
        let score = buildBattle.score;
        let title = 0 <= score && score < 100 ? 'Rookie' :
            100 <= score && score < 250 ? 'Untrained' :
            250 <= score && score < 500 ? 'Amateur' :
            500 <= score && score < 1000 ? 'Apprentice' :
            1000 <= score && score < 2000 ? 'Experienced' :
            2000 <= score && score < 3500 ? 'Seasoned' :
            3500 <= score && score < 5000 ? 'Trained' :
            5000 <= score && score < 7500 ? 'Skilled' :
            7500 <= score && score < 10000 ? 'Talented' :
            10000 <= score && score < 15000 ? 'Professional' :
            15000 <= score && score < 20000 ? 'Expert' :
            20000 <= score ? 'Master' : '';

        let mainStats = `
                    • Coins: **${buildBattle.coins}**
                    • Score: **${score}**
                    • Title: **${title}**
                    • Wins: **${buildBattle.wins}**
                    • Games Played: **${buildBattle.games_played}**
                    • Total Votes: **${buildBattle.total_votes}**`;
        let statsByGame = `
                    • Solo Wins: **${buildBattle.wins_solo_normal}**
                    • Solo Pro Wins: **${buildBattle.wins_solo_pro}**
                    • Teams Wins: **${buildBattle.wins_teams_normal}**
                    • Guess The Build Wins: **${buildBattle.wins_guess_the_build}**`;

        let buildBattleStats = new KayaEmbed({
            author: {
                name: `${args[0]} | Build Battle Stats`,
                icon_url: 'https://visage.surgeplay.com/face/' + data.uuid
            },
            fields: [{
                    name: '**General Stats**',
                    value: mainStats
                },
                {
                    name: '**Stats By Game**',
                    value: statsByGame
                }
            ]

        })
        message.channel.send(buildBattleStats)
    } catch (err) {
        message.channel.send("Error: " + err.message)
    }


    //TODO: Leaderboard Check for Builder Title
})