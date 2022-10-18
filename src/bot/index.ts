import { Client, GatewayIntentBits, Message } from "discord.js";
import * as puppeteer from "puppeteer";
import { ScreenshotService } from "./service/ScreenshotService"
import { logger } from "../mainlogger";


export default class Bot {
    client: Client;
    screenshotService: ScreenshotService

    constructor() {
        this.screenshotService = new ScreenshotService
        
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessages
            ]
        });
    }

    public async start() {
        logger.info(`Starting...`)
        const browser = await puppeteer.launch({
            executablePath: process.env.CHROME_BIN,
            args: ['--no-sandbox', '--disable-gpu', '--headless']
        });
        logger.debug(`Start: process.env.DISCORD_TOKEN = ${process.env.DISCORD_TOKEN}`)
        if (process.env.DISCORD_TOKEN == null) throw new Error("DISCORD_TOKEN is null or undefined");
        await this.client.login(process.env.DISCORD_TOKEN);
        logger.info(`Started`)

        this.client.on("messageCreate", async(msg: Message) => {
            const name = "nav".toLowerCase();
            if (msg.content[0] !== "/" && !msg.content.toLowerCase().substring(1, name.length).includes(name)) return;
            await this.screenshotService.attemptReplyWithScreenshot(browser, msg);
        });
    }
}