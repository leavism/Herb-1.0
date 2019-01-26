exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    let embed = {
        title: `**Simbad Regime**`,
        description: `**Home: Farowalan / Bamford City**`,
        thumbnail: { url: message.guild.iconURL },
        color: 3447003,
        fields: [
            {
                name: '**EDDB Links:**',
                value: '**System: **https://eddb.io/system/4751\n **Station: **https://eddb.io/station/4799'
            },
            {
                name: '**Nearest Mat Traders:**',
                value: '**Raw: **Estae / Cogswell Dock - 24.78ly\n**Manufactured: **Farowalan / Bamford City - 0.0ly\n**Encoded: **HR 1257 / Jacobi Platform - 19.04ly'
            },
            {
                name: '**Nearest Tech Brokers:**',
                value: '**Guardian: **Diaguandri / Ray Gateway - 36.61ly\n**Human: **Ainunnicori / Tani Hub - 31.93ly'
            },
            {
                name: '**Nearest Interstellar Factors:**',
                value: 'Lokipi / Reed Installation - 8.66ly'
            }
        ]
    }

    message.channel.send({ embed })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "home",
    category: "Elite",
    description: "Displays our home system's info.",
    usage: "?home",
    example: ["?home"]
};
