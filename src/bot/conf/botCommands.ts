import {
    RESTPostAPIApplicationCommandsJSONBody,
    APIApplicationCommandOptionChoice,
    SlashCommandBuilder,
    SlashCommandStringOption,
} from "discord.js";
import { ChuckNorrisService } from "../service/ChuckNorrisService";

export const botCommands = async (): Promise<RESTPostAPIApplicationCommandsJSONBody[]> => {
    // screenshot
    const captureCommand = new SlashCommandBuilder()
        .setName("capture")
        .setDescription("Capture screenshot of given website!")
        .addStringOption((option: SlashCommandStringOption) =>
            option.setName("url").setDescription("Url for any website").setRequired(true),
        );

    // norris
    const chucknorrisCategories = await ChuckNorrisService.getCategories();
    const choices = chucknorrisCategories.map((c) => {
        const choice: APIApplicationCommandOptionChoice<string> = {
            name: c,
            value: c,
        };
        return choice;
    });
    const chucknorrisCommand = new SlashCommandBuilder()
        .setName("chuck")
        .setDescription("Get a Chuck Norris joke")
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName("category")
                .setDescription("What kind of joke do you want?")
                .setRequired(false)
                .addChoices(...choices),
        );

    return [chucknorrisCommand, captureCommand].map((command) => command.toJSON());
};
