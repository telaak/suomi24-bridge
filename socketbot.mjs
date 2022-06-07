import { Client, Intents } from "discord.js";
import { getAllUserData } from "./users.js";
import "dotenv/config";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
import express from "express";
const app = express();
import cors from "cors";
app.use(cors());
import { createServer } from "http";
import { Server } from "socket.io";
const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});

client.once("ready", () => {
  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  io.on("connection", (socket) => {
    console.log("connection");
    socket.on("message", (messageObject) => {
      let messageJson = JSON.parse(messageObject);
      if (messageJson.username !== process.env.USERNAME) {
        channel.send(`${messageJson.username} ${messageJson.message}`);
      }
    });
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel === channel) {
      let guildMember = await message.guild.members.fetch(message.author);
      console.log(message.content);
      io.emit(
        "message",
        JSON.stringify({
          username: guildMember.displayName,
          message: message.content,
        })
      );
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === "tukari") {
      const userDataList = await getAllUserData();
      const tukarilaiset = userDataList.filter(
        (u) => u.roomName === "Tukikeskustelu"
      );
      await interaction.reply({
        content: tukarilaiset.map((u) => u.username).join("\n"),
        ephemeral: true,
      });
    }
  });
});

client.login(process.env.TOKEN);

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});
