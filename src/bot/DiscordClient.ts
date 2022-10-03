import { Client, GatewayIntentBits} from "discord.js";
import * as puppeteer from "puppeteer";


export class DiscordClient {

    client: Client;

    constructor() {
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


    public async login(): Promise<puppeteer.Browser> {
        console.log("Starting...");
        const browser = await puppeteer.launch({
            executablePath: process.env.CHROME_BIN,
            args: ['--no-sandbox', '--disable-gpu', '--headless']
        });
        if (process.env.DISCORD_TOKEN == null) throw new Error("DISCORD_TOKEN is null or undefined");
        await this.client.login(process.env.DISCORD_TOKEN);
        console.log("Started");

        return browser
    }

}