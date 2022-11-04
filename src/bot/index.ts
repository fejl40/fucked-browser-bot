import { ChatInputCommandInteraction, Client, GatewayIntentBits, Interaction } from "discord.js";
import * as puppeteer from "puppeteer";
import { ScreenshotService } from "./service/ScreenshotService";
import { logger } from "../mainlogger";
import { RegisterService } from "./service/RegisterService";
import { ChuckNorrisJoke, ChuckNorrisService } from "./service/ChuckNorrisService";

export default class Bot {
    client: Client;
    screenshotService: ScreenshotService;
    chuckNorrisService: ChuckNorrisService;
    registerService: RegisterService;

    constructor() {
        this.screenshotService = new ScreenshotService();
        this.chuckNorrisService = new ChuckNorrisService();
        this.registerService = new RegisterService();
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessages,
            ],
        });
    }

    public async captureCommand(
        interaction: ChatInputCommandInteraction,
        url: string,
        browser: puppeteer.Browser,
    ): Promise<void> {
        const imageUrlPromise = this.screenshotService.attemptReplyWithScreenshot(browser, url);
        await interaction.reply("Navigating to webpage...");
        const imageUrl = await imageUrlPromise;

        if (imageUrl != null) {
            await interaction.editReply(imageUrl);
        } else {
            await interaction.editReply("Failed to navigate to webpage");
        }
    }

    public async chuckNorrisCommand(interaction: ChatInputCommandInteraction, category: string | null) {
        let joke: ChuckNorrisJoke | null = null;
        if (category) {
            joke = await this.chuckNorrisService.getCategoryJoke(category);
        } else {
            joke = await this.chuckNorrisService.getRandomJoke();
        }

        if (joke) {
            await interaction.reply(joke.value);
        } else {
            await interaction.reply(`I got nothin son...`);
        }
    }

    public async start(DISCORD_TOKEN: string, CLIENT_ID: string) {
        logger.info(`Starting...`);

        this.registerService.registerCommands(CLIENT_ID, DISCORD_TOKEN);

        const browser = await puppeteer.launch({
            executablePath: process.env.CHROME_BIN,
            args: ["--no-sandbox", "--disable-gpu", "--headless"],
        });

        await this.client.login(DISCORD_TOKEN);

        this.client.on("ready", () => {
            logger.info(`Bot logged in as ${this.client.user?.tag}!`);
        });

        this.client.on("interactionCreate", async (interaction: Interaction) => {
            if (!interaction.isCommand()) return;
            const { commandName, options } = interaction;

            if (commandName === "capture") {
                const url = options.get("url")?.value as string;
                await this.captureCommand(interaction as ChatInputCommandInteraction, url, browser);
            } else if (commandName === "chuck") {
                const category = options.get("category")?.value as string | null;
                await this.chuckNorrisCommand(interaction as ChatInputCommandInteraction, category);
            }
        });
    }
}
