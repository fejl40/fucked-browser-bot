import express from "express";
import Bot from "./bot";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// default port is 3000
const port = isNaN(Number(process.env.PORT)) ? 3000 : Number(process.env.PORT);

// create very simple http server
const app = express();

// expose images folder
app.use(express.static('./images'));

// instantiate bot
const bot = new Bot();

// start http server on preset port
app.listen(port, async() => {
    await bot.start(); // start bot
    console.log(`HTTP server started on localhost:${port}`);
});