import {botCommands} from "../conf/botCommands"
import { logger } from "../../mainlogger";

const { REST, Routes } = require('discord.js');

export class RegisterService {

  rest: any;
  CLIENT_ID: string;
  
  constructor(discordToken: string, clientId: string) {
        this.rest = new REST({ version: '10' }).setToken(discordToken)
        this.CLIENT_ID = clientId
  }

  registerCommands() {
      (async () => {
          try {
            logger.info('Started refreshing application (/) commands.')
        
            await this.rest.put(Routes.applicationCommands(this.CLIENT_ID), { body: botCommands });
        
            logger.info('Successfully reloaded application (/) commands.')
          } catch (error) {
            logger.error(`registerCommands error: ${error}`);
          }
        })();
  }
}

