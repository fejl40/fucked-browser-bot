import linkRegex from "./link";
import axios from "axios";
import { uploadImage } from "./uploadImage";
import { Client, GatewayIntentBits, Message } from "discord.js";
import * as puppeteer from "puppeteer";


export interface ChatLink {
    full: string;
    body: string;
    uri: string;
    protocol: "https"|"http";
    index: number;
    fullMessage: string;
}

export default class Bot {
    client: Client;
    defaultViewPort: puppeteer.Viewport;
    defaultScreenShotOptions: puppeteer.ScreenshotOptions;
    defaultWaitForOptions: puppeteer.WaitForOptions;
    defaultImageLocation: string;

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

        this.defaultViewPort = {
            width: 1920,
            height: 1080
        };

        this.defaultScreenShotOptions = {
            type: "jpeg",
            quality: 100
        };

        this.defaultWaitForOptions = {
            waitUntil: "networkidle2"
        };

        this.defaultImageLocation = "./images/latest.jpeg";
    }

    public linkFromString(str: string): ChatLink|null {
        const link = linkRegex.exec(str);
        if (!link) return null;
        const protocol: "https"|"http" = link[1] === "https" ? "https" : "http";
        const obj: ChatLink = {
            full: link[0],
            protocol,
            body: link[2],
            uri: link[3],
            index: link.index,
            fullMessage: link.input
        };
        const lastPartOfUri = obj.uri.substring(obj.uri.lastIndexOf("/")).toLowerCase();
        if (lastPartOfUri.includes(".jpeg")) return null;
        if (lastPartOfUri.includes(".png")) return null;
        if (lastPartOfUri.includes(".svg")) return null;
        if (lastPartOfUri.includes(".webp")) return null;
        return obj;
    }

    public async screenshot(browser: puppeteer.Browser, url: string): Promise<string|null>
    {
        try {
            const req = await axios.get(url);
            if (req.status !== 200) return null;
        } catch (error) {
            console.error("invalid url", url);
            return null;
        }
        

        const page = await browser.newPage();

        const pageSetupPromises: Promise<void>[] = [];
        pageSetupPromises.push(page.setViewport(this.defaultViewPort));
        pageSetupPromises.push(page.setUserAgent("Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"));
        await Promise.all(pageSetupPromises);

        await page.goto(url, this.defaultWaitForOptions);
        await page.screenshot({ ...this.defaultScreenShotOptions, path: this.defaultImageLocation });
        const closePromise =  page.close();
        const imageUrl = await uploadImage(this.defaultImageLocation.substring(1));
        await closePromise;
        return imageUrl;
    }

    public async start()
    {
        console.log("Starting...");
        const browser = await puppeteer.launch({
            executablePath: process.env.CHROME_BIN,
            args: ['--no-sandbox', '--disable-gpu', '--headless']
        });
        await this.client.login(process.env.DISCORD_TOKEN);
        console.log("Started");

        this.client.on("messageCreate", async(msg: Message) => {
            if (msg.author.bot) return;
            const link = this.linkFromString(msg.content);
            if (link) {
                const lastPartOfUri = link.uri.substring(link.uri.lastIndexOf("/")).toLowerCase();
                if (lastPartOfUri.includes(".jpeg")) return;
                if (lastPartOfUri.includes(".png")) return;
                if (lastPartOfUri.includes(".svg")) return;
                if (lastPartOfUri.includes(".webp")) return;
            }

            if (link) {
                console.log("Found link!");
                const loadingPromise = msg.react("🧠");
                const url = await this.screenshot(browser, link.full);
                console.log(link.full, "->", url);
                await loadingPromise;
                await msg.reactions.removeAll();
                if (url) {
                    await msg.reply(url);
                    await msg.react("✔");
                } else {
                    await msg.react("❌");
                }
            }
        });
    }
}