export interface RoleModel {
    channelID: string;
    messageId: string | undefined;
    message: string;
    roleModels: Array<Roles>;
}

/**
 * Det giver mening at bruge class ROLE og roleID. I json fil
 * skaber bedre overblik
 */
export interface Roles {
    roleId: string;
    roleEmojiId: string;
}
