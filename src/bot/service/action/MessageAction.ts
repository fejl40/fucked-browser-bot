import { Guild, GuildMember } from "discord.js";
import { logger } from "../../../mainlogger";

export class MessageAction {
    action: string;
    targetUser: string;
    guild: Guild;
    member?: GuildMember;

    constructor(action: string, targetUser: string, guild: Guild) {
        this.action = action;
        this.targetUser = targetUser;
        this.guild = guild;
        this.member = this.getMember(targetUser);
    }

    getMember(id: string): GuildMember | undefined {
        return this.guild.members.cache.get(id) ?? undefined;
    }

    disconnectMember(): void {
        if (this.member == undefined) {
            logger.error("could not disconnectMember - member is undefined");
            return;
        }
        logger.info("DC'ing user: " + this.member?.user.username);
        this.member.voice.disconnect();
    }

    deafenMember(): void {
        if (this.member == undefined) {
            logger.error("could not disconnectMember - member is undefined");
            return;
        }
        logger.info("deaf'ing user: " + this.member?.user.username);
        this.member.voice.setDeaf();
    }
}
