import * as puppeteer from "puppeteer";
import axios from "axios";
import { uploadImage } from "../uploadImage";
import { Client, Collection, GatewayIntentBits, Message, REST, SlashCommandBuilder } from "discord.js";
import {FilterService} from "../service/FilterService"

export class ScreenshotService {

    defaultViewPort: puppeteer.Viewport;
    defaultScreenShotOptions: puppeteer.ScreenshotOptions;
    defaultWaitForOptions: puppeteer.WaitForOptions;
    defaultImageLocation: string;
    filterService: FilterService

constructor() {
    this.filterService = new FilterService

    this.defaultViewPort = {
        width: 1920,
        height: 1080
    };

    this.defaultScreenShotOptions = {
        fullPage: true,
        type: "jpeg",
        quality: 100
    };

    this.defaultWaitForOptions = {
        waitUntil: "networkidle2"
    };

    this.defaultImageLocation = "./images/latest.jpeg";
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

    const pageSetupPromises: Promise<void|unknown>[] = [];
    pageSetupPromises.push(page.setViewport(this.defaultViewPort));
    pageSetupPromises.push(page.setUserAgent("Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"));
    pageSetupPromises.push(page.evaluate("console.log('Asshole!');"));
    await Promise.all(pageSetupPromises);

    await page.goto(url, this.defaultWaitForOptions);
    await page.screenshot({ ...this.defaultScreenShotOptions, path: this.defaultImageLocation });
    const closePromise =  page.close();
    const imageUrl = await uploadImage(this.defaultImageLocation.substring(1));
    await closePromise;
    return imageUrl;
}

    public async attemptReplyWithScreenshot(browser: puppeteer.Browser, msg: Message)
    {
        if (msg.author.bot) return;
        const link = this.filterService.linkFromString(msg.content)

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
    }


}