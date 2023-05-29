module.exports = {
  botName: "NOVA", //Bot Name
  invite_url:
    "https://discord.com/api/oauth2/authorize?client_id=892554379972696576&permissions=8&scope=bot%20applications.commands", //Bot Invite Link
  support_server: {
    invite: "https://discord.gg/2x2k69YJ", //Support Server Invite Link
    id: "892554379972696576", //Support Server ID
  }, //Support Server Link
  token: process.env.TOKEN, //Discord Bot Token
  MongoURL:
    "mongodb+srv://xd666:naveen123@cluster.gbcmjjt.mongodb.net/?retryWrites=true&w=majority", //if dbType = MONGO, this is required else skip
  loadSlashsGlobal: true,
  prefix: "!", //Bot Prefix
  dirSetup: [
    {
      Folder: "Info",
      CmdName: "info",
      CmdDescription: "Grant specific Information about something!",
    },
    {
      Folder: "Selfrole",
      CmdName: "selfrole",
      CmdDescription: "Make selfroles for your Server!",
    },
    {
      Folder: "Utility",
      CmdName: "utility",
      CmdDescription: "Utility Commands for your Server!",
    },
    {
      Folder: "Moderation",
      CmdName: "moderation",
      CmdDescription: "Moderation Commands for your Server!",
    },
    {
      Folder: "Owner",
      CmdName: "owner",
      CmdDescription: "Owner Commands for develoeprs!",
    },
    {
      Folder: "Games",
      CmdName: "games",
      CmdDescription: "Games Commands for your Server!",
    },
    {
      Folder: "Setup",
      CmdName: "setup",
      CmdDescription: "Setup features for your Server!",
    }
  ],
};
