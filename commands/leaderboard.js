const moment = require('moment')
const fs = require('fs')

exports.run = async (client, message, [action, ...values]) => {
    switch (action) {
        case 'reset':
            if (message.member.user.id == 454845440408420353) {
                let empty = []
                fs.writeFileSync('./data/forza.json', JSON.stringify(empty))
                return message.reply("Leaderboard reset! Have a fast week ;)")
            }
            else {
                return message.reply("Only <@454845440408420353> can do that. Sorry!")
            }
            break
        case 'add':
            if (message.attachments.size > 0) {
                if (values.length === 1 || values.length === 2) {
                    let user = message.author.username
                    let time = values[0]
                    let flag = false
                    if (values.length === 2) {
                        if (values[1] === '!') {
                            flag = true
                        }
                    }
                    if (isValidFormat(time)) {
                        let mm = Number(time.split(':')[0])
                        let sString = time.split(':')[1]
                        let s = Number(sString.split('.')[0])
                        let ms = sString.split('.')[1]
                        let sTime = (mm * 60) + s + "." + ms

                        let record = {
                            name: user,
                            time: time,
                            seconds: sTime,
                            flag
                        }

                        fs.readFile('./data/forza.json', (err, data) => {
                            if (err) {
                                console.log(err)
                                return message.reply("Sorry, there was a weird error. Ask bevers about it.")
                            }
                            let times = JSON.parse(data);

                            let index = times.findIndex(time => time.name === record.name)
                            if (index != -1) {
                                times.splice(index, 1)
                            }
                            times.push(record)

                            times.sort(function (a, b) {
                                return a.seconds - b.seconds;
                            });

                            fs.writeFileSync('./data/forza.json', JSON.stringify(times))
                        });
                        if (flag) {
                            return message.reply(`Your dirty lap time of ${time} has been added!`)
                        }
                        else {
                            return message.reply(`Your clean lap time of ${time} has been added!`)
                        }

                    }
                    else {
                        return message.reply("Sorry, can't add that one! Your time input was incorrect. <xx:xx.xxx>   TIME INPUT IS STRICT REMEMBER")
                    }
                }
                else {
                    return message.reply("Sorry, can't add that one! Make sure you are running ?leaderboard add <name> <xx:xx.xxx>   TIME INPUT IS STRICT REMEMBER")
                }
            }
            else {
                return message.reply("You need to attach a screenshot for proof!")
            }

            break
        case 'help':
            message.channel.send(`?leaderboard - displays the leaderboard **Times are reset every week**\n?leaderboard add <time> <!> - Adds/updates your time on the leaderboard. If it is a dirty lap, add a !\n\n ex. ?leaderboard add 01:24.455\n\nSome rules to follow:\n1.You must have your time in the format of mm:ss.xxx. ex: 01:25.123.\n2. You must add a space and a ! after your time to mark it as a dirty lap.\n3. You must attach a screenshot with your time to add it to the list.\n4.This is built on the honor system. The only way for us to know your real time is the screenshot. Do not try to cheat the leaderboard.\n\n**Bevers is always watching and will ban you from the command.**`)

            break
        case 'leaderboard':
            fs.readFile('./data/forza.json', (err, data) => {
                if (err) {
                    console.log(err)
                    return message.reply("Sorry, there was a weird error. Ask bevers about it.")
                }
                let times = JSON.parse(data);
                let tList = "< Simbad Weekly Leaderboard >\n# WEEK 3\n# El Camino Beach Blitz\n# 1970 Chevy El Camino Super Sport - A Class\n"
                if (times.length <= 0) {
                    return message.reply("Sorry, no times available yet! Add your own!")
                }
                times.forEach((time, i) => {
                    if (time.flag) {
                        tList += `${i + 1}. ${time.name} - ${time.time} (Dirty Lap)\n`
                    }
                    else {
                        tList += `${i + 1}. ${time.name} - ${time.time}\n`
                    }

                });

                message.channel.send(tList, { code: "md" })
            });
            break
        case 'info':
            message.channel.send('**= How to play Forza Horizon 4 =**\n- 1st month subscription code (only works once per account) - <https://www.cdkeys.com/xbox-live/memberships/1-month-xbox-game-pass-xbox-one-360>\n- From the official website (there is a 15 day trial available too) - <https://www.microsoft.com/en-us/p/xbox-game-pass/cfq7ttc0k6l8/000B?rtc=1>\n- Forza Horizon 4 demo <https://www.microsoft.com/en-us/p/forza-horizon-4-demo/9p8cp1l72jxs#activetab=pivot:overviewtab>\n```Minimum Requirements:\n\nOS: Windows 10 version 15063.0 or higher\nDirectX: DirectX 12 API\nMemory: 8GB\nVRAM: 2GB\nProcessor: Intel i3-4170 @ 3.7Ghz or Intel i5 750 @ 2.67Ghz\nGraphics card: Nvidia GTX 650 Ti or Nvidia GT 740 or AMD R7 250x\n\nRecommended:\nOS: Windows 10 version 15063.0 or higher\nDirectX: DirectX 12 API\nMemory: 12GB\nVRAM: 4GB\nProcessor: Intel i7-3820 @ 3.6Ghz\nGraphics: Nvidia GTX 970 or NVidia GTX 1060 3GB or AMD R9 290x or AMD RX 470```')
            break
        default:
            message.channel.send(`?forza leaderboard\n?forza add\n?forza info\n?forza help`)
            break
    }
}

function isValidFormat(time) {
    let valid = moment(time, "mm:ss.SSS", true).isValid()
    return valid
}



exports.conf = {
    enabled: true,
    guildOnly: false,
    permLevel: "User"
};

exports.help = {
    name: "forza",
    category: "Server",
    description: "Forza commands",
    usage: "?forza",
    example: ["?forza <add> <time> <!>"]
};