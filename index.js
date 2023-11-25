const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const clientId = 'BOT_USER_ID'; // ボットのクライアントID
const guildId = 'YOUR_SERVER_ID'; // コマンドを登録するサーバーのID
const allowedUserId = 'YOUR_USER_ID'; // 使用するユーザーのIDを指定
const allowedGuildId = 'YOUR_SERVER_ID'; // 使用するサーバーのIDを指定

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // スラッシュコマンドの登録(サーバーに同じBotがいないと機能しません)
  await client.guilds.cache.get(guildId)?.commands.create({
    name: 'sendmessage',
    description: '指定したサーバーとチャンネルにメッセージを送信します。',
    type: 1, // 1はCHAT_INPUT
    options: [
      {
        name: 'serverid',
        description: '送信先のサーバーID',
        type: 3, // 3はSTRING
        required: true,
      },
      {
        name: 'channelid',
        description: '送信先のチャンネルID',
        type: 3, // 3はSTRING
        required: true,
      },
      {
        name: 'message',
        description: '送信するメッセージの内容',
        type: 3, // 3はSTRING
        required: true,
      },
    ],
  });

  console.log('Slash command registered!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, user, guild } = interaction;

  // 特定のサーバーとユーザーのみ処理を続行
  if (guild.id !== allowedGuildId || user.id !== allowedUserId) {
    return interaction.reply('権限がありません。');
  }

  // ここでコマンドに対する処理を書く
  if (commandName === 'sendmessage') {
    const channelToMessageId = options.getString('channelid');
    const messageContent = options.getString('message');

    // メッセージを送信
    const channelToSend = client.channels.cache.get(channelToMessageId) ||
      guild.channels.resolve(channelToMessageId);
    
    if (channelToSend) {
      channelToSend.send(messageContent);
      return interaction.reply('メッセージが送信されました。');
    } else {
      return interaction.reply('指定されたチャンネルIDが見つかりません。');
    }
  }
});

//  Botをログインさせる
client.login('YOUR_BOT_TOKEN');
