import { Client, Intents } from "discord.js";
import { getAllUserData } from "./users.js";
import "dotenv/config";
import { readFileSync, writeFileSync } from "fs";

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

const nicksJsonFile = readFileSync("./nicks.json", "utf-8");
const nicksJson = JSON.parse(nicksJsonFile);

client.once("ready", () => {
  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  io.on("connection", (socket) => {
    console.log("connection");
    socket.on("message", async (messageObject) => {
      let messageJson = JSON.parse(messageObject);
      if (messageJson.username !== process.env.USERNAME) {
        let parsedMessage = messageJson.message
        const regex = /http:\/\/chat\.suomi24\.fi\/img\/vip\/[a-z]{1,}\.gif/g;
        const found = parsedMessage.match(regex);
        if (found) {
          for (const f of found) {
            const gifRegex = /[a-z]{1,}\.gif/g;
            const gif = f.match(gifRegex)[0];
            const guild = await client.guilds.fetch(process.env.GUILD_ID)
            const emojiReplacement = guild.emojis.cache?.find(
              (emoji) => emoji.name == gif.replace(".gif", "")
            )
            parsedMessage = parsedMessage.replace(f, emojiReplacement)
  
          }
          console.log(parsedMessage)
        }
        channel.send(`${messageJson.username} ${parsedMessage}`);
      }
    });
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel === channel) {
      let guildMember = await message.guild.members.fetch(message.author);
      const userName = nicksJson[guildMember]
        ? nicksJson[guildMember]
        : guildMember.displayName;
      console.log(`${userName}: ${message.content}`);
      io.emit(
        "message",
        JSON.stringify({
          username: userName,
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

    if (commandName === "nimimerkki") {
      const newNick = interaction.options.getString("nimimerkki");
      const regex = /^[a-zA-Z0-9_]*$/
      if (regex.test(newNick)) {
        const guildMember = interaction.member;
        nicksJson[guildMember] = newNick;
        writeFileSync("./nicks.json", JSON.stringify(nicksJson));
        await interaction.reply({
          content: `Uusi nimimerkkisi on: ${newNick}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `Väärin muotoiltu nimimerkki: ${newNick}`,
          ephemeral: true,
        })
      }
    }
  });
});

client.login(process.env.TOKEN);

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});
