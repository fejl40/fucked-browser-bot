import { botCommands } from "../conf/botCommands";
import { logger } from "../../mainlogger";
import { REST, Routes } from "discord.js";

export class RegisterService {
    rest: REST;

    constructor() {
        this.rest = new REST();
    }

    async registerCommands(CLIENT_ID: string, discordToken: string): Promise<void> {
        this.rest = new REST({ version: "10" }).setToken(discordToken);
        try {
            logger.info("Started refreshing application (/) commands.");
            const commands = await botCommands();
            await this.rest.put(Routes.applicationCommands(CLIENT_ID), {
                body: commands,
            });

            logger.info("Successfully reloaded application (/) commands.");
        } catch (error) {
            logger.error(`registerCommands error: ${error}`);
        }
    }
}
