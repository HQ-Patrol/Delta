module.exports = {
  name: "ping",
  category: "information",
  description: "Shows bot's current ping and latency!",
  cooldown: 1,
  run: async (client, message, _args) => {
    const msg = await message.channel.send("🏓 Pinging....");
    msg.edit(`🏓 Pong \n:small_orange_diamond: Latency is \`${Math.floor(msg.createdAt - message.createdAt)}ms\`\n:small_orange_diamond: API Latency \`${Math.round(client.ws.ping)}ms\`\n:small_blue_diamond: You are on cluster ID **${client.cluster?.id}**, shard ID **${message.guild?.shardId}**.`);
  },
};
