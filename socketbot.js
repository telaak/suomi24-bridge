import { Client, Intents } from "discord.js";
import { getAllUserData } from "./users.js";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});

client.once("ready", () => {
  const channel = client.channels.cache.get("907467396414070805");
  io.on("connection", (socket) => {
    console.log("connection");
    socket.on("message", (messageObject) => {
      let messageJson = JSON.parse(messageObject);
      if (messageJson.username !== "viestisilta") {
        channel.send(`${messageJson.username} ${messageJson.message}`);
      }
    });
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel === channel) {
      let guildMember = await message.guild.members.fetch(message.author);
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

client.login("");

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});
