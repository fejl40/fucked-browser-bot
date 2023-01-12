import {
    ChatInputCommandInteraction,
    Client,
    GatewayIntentBits,
    Guild,
    GuildMember,
    Interaction,
    italic,
    Partials,
    TextChannel,
    ThreadAutoArchiveDuration,
    UserFlags,
} from "discord.js";
import fs from "fs";
import * as puppeteer from "puppeteer";
import { ScreenshotService } from "./service/ScreenshotService";
import { logger } from "../mainlogger";
import { RegisterService } from "./service/RegisterService";
import { ChuckNorrisJoke, ChuckNorrisService } from "./service/ChuckNorrisService";
import { MessageAction } from "./service/action/MessageAction";
import { ReactionService } from "./service/ReactionService";
import { RoleModel } from "./model/RoleModel";

export default class Bot {
    client: Client;
    screenshotService: ScreenshotService;
    chuckNorrisService: ChuckNorrisService;
    reactionService: ReactionService;
    registerService: RegisterService;
    guild: Guild | undefined;

    //read from file here
    roleModelJson =
        '{ "channelID": "1063157534137012254", "message": "for at undgå spam! Kan man nu assign sig selv roller \\n discgolf: <:discgolf:1059220499080695928> \\n wow: <:wow:1059220500808728607> \\n cs: <:cs:1059220497226801323> \\n rust: <:rust:1059220495087710228> \\n dev: <:dev:1059218844209651864> \\n eft: <:eft:1045064039102955581>", "roleModels": [ { "roleId": "1063154879079657582", "roleEmojiId": "1059220499080695928" }, { "roleId": "1063154842622767114", "roleEmojiId": "1059220500808728607" }, { "roleId": "1063154935014895718", "roleEmojiId": "1059220497226801323" }, { "roleId": "1063154956871418057", "roleEmojiId": "1059220495087710228" }, { "roleId": "1063155001649803265", "roleEmojiId": "1059218844209651864" }, { "roleId": "1063155026593337476", "roleEmojiId": "1045064039102955581" } ] }';

    roleModel: RoleModel;

    constructor() {
        this.screenshotService = new ScreenshotService();
        this.chuckNorrisService = new ChuckNorrisService();
        this.registerService = new RegisterService();
        this.reactionService = new ReactionService();
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessages,
            ],
            partials: [Partials.Channel, Partials.Reaction, Partials.Message],
        });
        this.roleModel = JSON.parse(this.roleModelJson);
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
            this.guild = this.client.guilds.cache.get("988472386456268800");
            logger.info("Online on: " + this.guild?.name);

            if (this.roleModel.channelID != undefined && this.guild != undefined) {
                this.reactionService.reactionMessage(this.guild, this.roleModel);
            }

            this.client.user?.setUsername("Awesome-O");
            this.client.user?.setAvatar(
                "https://i5.walmartimages.com/asr/76cee6cd-6241-4ee0-847f-ca2ea8823798.08fdc6be95e38e7e4cbd0ece6f30aac2.png",
            );
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

        this.client.on("messageCreate", async (messageCreate) => {
            const approvedAuthors: string[] = ["916059679665311774", "379338115418030092", "227727575357718528"];

            const content = messageCreate.content;
            logger.info("Modtaget DM: " + content);
            logger.info("From: " + messageCreate.author.username);

            if (!approvedAuthors.includes(messageCreate.author.id)) {
                logger.warn("DM unauthorized access from user: " + messageCreate.author.username);
                // messageCreate.delete();
                return;
            }

            if (this.guild == undefined) {
                logger.error("could not get guild");
                return;
            }

            //message format <action> <target-userid> <amount>
            // dc 123
            const someBetterName = content.split(" ");

            //smid guild med på MessageAction og lav methoder der kan dc osv
            const messageAction = new MessageAction(someBetterName[0], someBetterName[1], this.guild);

            if (approvedAuthors.includes(messageAction.targetUser)) {
                messageCreate.author.send("Not allowed to disconnect that user! This incident will be reported");
                logger.warn("friendly fire: " + messageCreate.author);
                return;
            }

            //lav switch på action dc mute deaf osv osv..
            switch (messageAction.action) {
                case "dc":
                    // messageAction.disconnectMember();
                    // messageCreate.author.send("User disconnected");
                    messageCreate.author.send("Sorry im not allowed to do that");
                    break;

                case "deaf":
                    // messageAction.deafenMember();
                    // messageCreate.author.send("User deafen");
                    messageCreate.author.send("Sorry im not allowed to do that");
                    break;

                case "rolereact":
                    if (messageCreate.author.id == "916059679665311774") {
                        messageCreate.author.send("creating reacting roles");
                        logger.info("creating reacting roles");
                        if (this.roleModel.channelID != undefined && this.guild != undefined) {
                            this.reactionService.reactionMessage(this.guild, this.roleModel);
                        }
                    }
                    break;

                default:
                    break;
            }
            return;
        });

        this.client.on("messageReactionAdd", async (reaction, user) => {
            if (user.bot) {
                return;
            }
            const guildmember = this.guild?.members.cache.get(user.id);

            if (guildmember == undefined) {
                logger.error("messageReactionAdd: guild member undefined userId: " + user.id);
                return;
            }

            if (reaction.message.id == this.roleModel.messageId) {
                this.roleModel.roleModels.forEach((it) => {
                    if (it.roleEmojiId == reaction.emoji.id) {
                        this.reactionService.addRole(guildmember, it.roleId);
                    }
                });
            }
        });
    }
}
