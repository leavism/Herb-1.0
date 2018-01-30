module.exports = async client => {
  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for all of them to be loaded.
  await client.wait(1000);

  // Both `wait` and `client.log` are in `./modules/functions`.
  client.logger.log(`[READY] ${client.user.tag} is ready to server. Lets rock and roll!`);
  console.log(`--------------------\n${client.user.username} - Discord Bot\n--------------------\n${client.user.tag}\n\nConnected to:\n${client.guilds.size} servers\n${client.users.size} users\n`);
  client.generateInvite([])
    .then(link => {
      console.log(`\nInvite link with no permissions: ${link}`)
    })

  // We check for any guilds added while the bot was offline, if any were, they get a default configuration.
  client.guilds.filter(g => !client.settings.has(g.id)).forEach(g => client.settings.set(g.id, client.config.defaultSettings));
};
