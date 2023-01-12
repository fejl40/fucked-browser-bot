import { GuildMember, Guild, Message, TextChannel } from "discord.js";
import { logger } from "../../mainlogger";
import { RoleModel, Roles } from "../model/RoleModel";

export class ReactionService {
    addRole(guildMember: GuildMember, roleId: string): void {
        guildMember.roles.add(roleId);
    }

    addReactions(roles: Array<Roles>, message: Message): void {
        roles.forEach((it) => {
            message.react(it.roleEmojiId);
        });
    }

    async reactionMessage(guild: Guild, roleModel: RoleModel) {
        const channel = guild.channels.cache.get(roleModel.channelID) as TextChannel;
        if (roleModel.messageId == undefined) {
            const newMessage = await channel.send(roleModel.message);
            roleModel.messageId = newMessage.id;
            this.addReactions(roleModel.roleModels, newMessage);
        } else {
            const message = await channel.messages.fetch(roleModel.messageId);
            if (roleModel.message != message?.content) {
                message?.edit(roleModel.message);
                this.addReactions(roleModel.roleModels, message!);
            }
        }
    }
}
