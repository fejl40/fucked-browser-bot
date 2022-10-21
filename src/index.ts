import express from "express";
import Bot from "./bot";
import dotenv from "dotenv";
import { logger } from "./mainlogger";

// Load environment variables
dotenv.config();

// default port is 3000
const port = isNaN(Number(process.env.PORT)) ? 3000 : Number(process.env.PORT);

// create very simple http server
const app = express();

// expose images folder
app.use(express.static("./images"));

// instantiate bot
const bot = new Bot();

// start http server on preset port
app.listen(port, async () => {
    const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
    logger.debug(`Start: process.env.DISCORD_TOKEN: = ${DISCORD_TOKEN}`);
    if (DISCORD_TOKEN == null) throw new Error("DISCORD_TOKEN is null or undefined");

    const CLIENT_ID = process.env.CLIENT_ID;
    logger.debug(`Start: process.env.CLIENT_ID: = ${CLIENT_ID}`);
    if (CLIENT_ID == null) throw new Error("CLIENT_ID is null or undefined");

    await bot.start(DISCORD_TOKEN, CLIENT_ID);
    logger.info(`HTTP server started on localhost:${port}`);
});
